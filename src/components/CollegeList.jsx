import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", 
    "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", 
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", 
    "MN", "MS", "MO", "MT", "NE", "NV", "NH", 
    "NJ", "NM", "NY", "NC", "ND", "OH", 
    "OK", "OR", "PA", "RI", "SC", "SD", 
    "TN", "TX", "UT", "VT", "VA", "WA", "WV", 
    "WI", "WY"
];


// Function to convert hex color to RGB and calculate brightness
const getBrightness = (hex) => {
    // Remove the "#" if present
    hex = hex.replace('#', '');

    // Convert shorthand hex colors like "#abc" to full form "#aabbcc"
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Extract the red, green, and blue components
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate brightness (standard formula for perceived brightness)
    return (0.299 * r + 0.587 * g + 0.114 * b);
};

const CollegeModal = ({ college, onClose }) => {
    if (!college) return null;  // Return nothing if no college is selected

    let str_tuition = college.tuition.toString();
    let formatted_tuition = str_tuition.slice(0, 2) + ',' + str_tuition.slice(2);

    // Split the colors string into an array of two colors
    const colors = college.colors ? college.colors.split(',') : ['#fff', '#fff'];  // Fallback to white if no color is available
    const primaryColor = colors[0].trim();  // First color
    const secondaryColor = colors[1] ? colors[1].trim() : '#fff';  // Second color or fallback to white

    // Calculate the brightness of the secondary color
    const brightness = getBrightness(secondaryColor);

    // Determine the text color based on brightness
    const textColor = brightness < 128 ? '#fff' : '#000';  // Use white text if the secondary color is dark, otherwise black

    // Apply the gradient background using the two colors and the calculated text color
    const modalStyle = {
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: textColor,  // Dynamically set text color based on brightness
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2>{college.name}</h2>
                <img src={college.image_url || 'https://via.placeholder.com/150'} alt={college.name} />
                <h3>Location: {college.location}</h3>
                <p>College Ranking: #{college.ranking || "No ranking available."}</p>
                <p>Acceptance Rate: {(college.acceptance_rate * 100).toFixed(1)}%</p>
                <p>Estimated Tuition: ${formatted_tuition}</p>
                <p>Avg SAT Score: {college.avg_SAT}</p>
                <p>Avg GPA: {college.avg_GPA}</p>
                <p>Description: {college.description || "No description available yet"}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};



const CollegeList = () => {
    const [colleges, setColleges] = useState([]);  
    const [page, setPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1);  
    const [loading, setLoading] = useState(false);  
    const [selectedCollege, setSelectedCollege] = useState(null);  // Track selected college for modal
    const [isModalOpen, setIsModalOpen] = useState(false);  // Track modal state
    const [searchQuery, setSearchQuery] = useState('');  // State for search query
    const [selectedState, setSelectedState] = useState('');  // State for selected state filter
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tuitionMin, setTuitionMin] = useState('');  // State for minimum tuition filter
    const [tuitionMax, setTuitionMax] = useState('');
    const [acceptanceMin, setAcceptanceMin] = useState('');  // State for minimum acceptance rate
    const [acceptanceMax, setAcceptanceMax] = useState('');
    const [gpaMin, setGpaMin] = useState('');  // State for minimum GPA
    const [gpaMax, setGpaMax] = useState('');
    const [SatMin, setSatMin] = useState('');
    const [SatMax, setSatMax] = useState('');

    useEffect(() => {
        fetchColleges(page, searchQuery, selectedState, tuitionMin, tuitionMax, acceptanceMin, acceptanceMax, gpaMin, gpaMax, SatMax, SatMin);
    }, [page, searchQuery, selectedState, tuitionMin, tuitionMax, acceptanceMin, acceptanceMax, gpaMin, gpaMax, SatMax, SatMin]);

    const fetchColleges = async (page, searchQuery, stateFilter, tuitionMin, tuitionMax, acceptanceMin, acceptanceMax, gpaMin, gpaMax, SatMax, SatMin) => {
        setLoading(true);
        
        try {
            // Build the params object conditionally
            const params = {
                page,
                search: searchQuery,
                location: stateFilter,
                acceptance_min: acceptanceMin || undefined,  // Add acceptance_min as query param
                acceptance_max: acceptanceMax || undefined,
                gpa_min: gpaMin || undefined,  // Add GPA filters here
                gpa_max: gpaMax || undefined,
                sat_min: SatMin || undefined,
                sat_max: SatMax || undefined

            };
        
            // Conditionally add tuition_min and tuition_max if they have valid values
            if (tuitionMin) {
                params.tuition_min = tuitionMin;
            }
        
            if (tuitionMax) {
                params.tuition_max = tuitionMax;
            }
        
            // Perform the API request with the params object
            const res = await axios.get('http://127.0.0.1:8000/api/colleges/', { params });
            
            setColleges(res.data.results);
            setTotalPages(res.data.total_pages);
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
        
    };

    const addCollegeToDashboard = async (collegeId) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/user/profile/add-college/', { college_id: collegeId });
            alert('College added to your dashboard');
        } catch (error) {
            console.error('Error adding college to dashboard:', error);
        }
    };
    
    
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle changes for GPA min and max
    const handleGpaMinChange = (e) => {
        setGpaMin(e.target.value);  // Update state for min GPA
    };

    const handleGpaMaxChange = (e) => {
        setGpaMax(e.target.value);  // Update state for max GPA
    };

    // Handle state selection from dropdown
    const handleStateSelect = (state) => {
        setSelectedState(state);  // Set the selected state as the filter
        setDropdownOpen(false);   // Close the dropdown after selection
    };
    
    // Handle changes for acceptanceMin
    const handleAcceptanceMinChange = (e) => {
        setAcceptanceMin(e.target.value);  // Remove commas and update state
    };

    // Handle changes for acceptanceMax
    const handleAcceptanceMaxChange = (e) => {
        setAcceptanceMax(e.target.value);  // Remove commas and update state
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        } else {
            setPage(1);
        }
    };

    // Handle changes for SAT Min and Max
    const handleSatMinChange = (e) => {
        setSatMin(e.target.value);  // Update state for SAT min
    };

    const handleSatMaxChange = (e) => {
        setSatMax(e.target.value);  // Update state for SAT max
    };

    const openModal = (college) => {
        setSelectedCollege(college);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCollege(null);
    };

    return (
        <div>
            {/* Filters button */}
            <div className="filter-dropdown">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="filter-button">
                    Filters
                </button>
    
                {dropdownOpen && (
                    <div className="filter-options">
                        {/* State filter dropdown */}
                        <div className="filter-item">
                            <label>Select State</label>
                            <select onChange={(e) => handleStateSelect(e.target.value)} value={selectedState}>
                                <option value="">Any</option>
                                {STATES.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
    
                        {/* Tuition filter inputs */}
                        <div className="filter-item">
                            <label>Tuition</label>
                            <div className="filter-group">
                                <input
                                    type="number"
                                    placeholder="Min Tuition"
                                    value={tuitionMin}
                                    onChange={(e) => setTuitionMin(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(tuitionMin);
                                        if (value < 5000 || value > 50000) {
                                            setTuitionMin("");  // Clear if invalid
                                            alert("Please enter a value between 5000 and 50000");
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Tuition"
                                    value={tuitionMax}
                                    onChange={(e) => setTuitionMax(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(tuitionMax);
                                        if (value < 5000 || value > 90000) {
                                            setTuitionMax("");  // Clear if invalid
                                            alert("Please enter a value between 5000 and 50000");
                                        }
                                    }}
                                />
                            </div>
                        </div>
    
                        {/* GPA filter inputs */}
                        <div className="filter-item">
                            <label>GPA</label>
                            <div className="filter-group">
                                <input
                                    type="number"
                                    placeholder="Min GPA"
                                    value={gpaMin}
                                    onChange={(e) => setGpaMin(e.target.value)}
                                    step="0.1"
                                    onBlur={() => {
                                        const value = parseFloat(gpaMin);
                                        if (value < 0.0 || value > 4.0) {
                                            setGpaMin("");  // Clear if invalid
                                            alert("Please enter a value between 0.0 and 4.0");
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max GPA"
                                    value={gpaMax}
                                    onChange={(e) => setGpaMax(e.target.value)}
                                    step="0.1"
                                    onBlur={() => {
                                        const value = parseFloat(gpaMax);
                                        if (value < 0.0 || value > 4.0) {
                                            setGpaMax("");  // Clear if invalid
                                            alert("Please enter a value between 0.0 and 4.0");
                                        }
                                    }}
                                />
                            </div>
                        </div>
    
                        {/* Acceptance rate filter inputs */}
                        <div className="filter-item">
                            <label>Acceptance Rate</label>
                            <div className="filter-group">
                                <input
                                    type="number"
                                    placeholder="Min Acceptance Rate"
                                    value={acceptanceMin}
                                    onChange={(e) => setAcceptanceMin(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(acceptanceMin);
                                        if (value < 0 || value > 100) {
                                            setAcceptanceMin("");  // Clear if invalid
                                            alert("Please enter a value between 0 and 100");
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max Acceptance Rate"
                                    value={acceptanceMax}
                                    onChange={(e) => setAcceptanceMax(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(acceptanceMax);
                                        if (value < 0 || value > 100) {
                                            setAcceptanceMax("");  // Clear if invalid
                                            alert("Please enter a value between 0 and 100");
                                        }
                                    }}
                                />
                            </div>
                        </div>
    
                        {/* SAT filter inputs */}
                        <div className="filter-item">
                            <label>SAT</label>
                            <div className="filter-group">
                                <input
                                    type="number"
                                    placeholder="Min SAT"
                                    value={SatMin}
                                    onChange={(e) => setSatMin(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(SatMin);
                                        if (value < 400 || value > 1600) {
                                            setSatMin("");  // Clear if invalid
                                            alert("Please enter a value between 400 and 1600");
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Max SAT"
                                    value={SatMax}
                                    onChange={(e) => setSatMax(e.target.value)}
                                    onBlur={() => {
                                        const value = parseInt(SatMax);
                                        if (value < 400 || value > 1600) {
                                            setSatMax("");  // Clear if invalid
                                            alert("Please enter a value between 400 and 1600");
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
    
            {/* College grid and other components remain unchanged */}
            <div className="college-grid">
                {loading ? (
                    <p>Loading colleges...</p>
                ) : colleges.length > 0 ? (
                    colleges.map((college) => (
                        <div key={college.id} className="college-card" onClick={() => openModal(college)}>
                            <img src={college.image_url || 'https://via.placeholder.com/150'} alt={college.name} />
                            <h3>{college.name}</h3>
                            <p>{college.location}</p>
                            <button onClick={(e) => { e.stopPropagation(); addCollegeToDashboard(college.id); }}>
                                Add to Dashboard
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No colleges found.</p>
                )}
            </div>
    
            {/* Pagination controls */}
            <div className="pagination-controls">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={handleNextPage}>
                    {page === totalPages ? 'Back to Beginning' : 'Next'}
                </button>
            </div>
    
            {/* Modal for selected college */}
            {isModalOpen && <CollegeModal college={selectedCollege} onClose={closeModal} />}
        </div>
    );
    
}    

export default CollegeList;
