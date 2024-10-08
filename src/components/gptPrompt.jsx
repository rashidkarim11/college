import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GptPromptForm = () => {
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');  // Full GPT response
  const [displayedResponse, setDisplayedResponse] = useState('');  // Response displayed progressively
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If gptResponse is updated, animate the response word by word
    if (gptResponse) {
      animateResponse(gptResponse);
    }
  }, [gptResponse]);

  const animateResponse = (response) => {
    const words = response.split(' ');  // Split the response into words
    let currentIndex = 0;
    setDisplayedResponse('');  // Clear displayed response

    const intervalId = setInterval(() => {
      setDisplayedResponse(prev => prev + words[currentIndex] + ' ');
      currentIndex++;

      // Stop when all words are displayed
      if (currentIndex >= words.length) {
        clearInterval(intervalId);
      }
    }, 100);  // Adjust the delay for the word-by-word animation (100 ms delay per word)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGptResponse('');  // Clear previous GPT response
    setDisplayedResponse('');  // Clear displayed response before new request

    try {
      const response = await axios.post('http://localhost:8000/api/gpt/', 
        { prompt: prompt },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setGptResponse(response.data.response);  // Set the full GPT response
    } catch (err) {
      setError('Error retrieving GPT response.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ask GPT</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="prompt">Enter your prompt:</label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            placeholder="Ask a question..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display GPT response progressively */}
      {displayedResponse && (
        <div className="gpt-response">
          <h3>GPT Response:</h3>
          <p>{displayedResponse}</p>  {/* Display the animated response */}
        </div>
      )}
    </div>
  );
};

export default GptPromptForm;

