import { useState, useEffect } from "react";
import axios from "axios";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const getToken = () => {
  return localStorage.getItem("access");
};

const UserCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    // Fetch events from the backend
    axios
      .get("http://localhost:8000/api/user/get_user_calendar/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const formattedEvents = response.data.map((event) => {
          const localStartTime = moment
            .utc(event.event_start_date)
            .tz("America/New_York")
            .toDate();
          const localEndTime = event.event_end_date
            ? moment.utc(event.event_end_date).tz("America/New_York").toDate()
            : moment(localStartTime).add(1, "hour").toDate(); // Fallback: add 1 hour to start time if end time is missing

          // Ensure the end date is always after the start date
          if (localEndTime <= localStartTime) {
            localEndTime.setTime(localStartTime.getTime() + 60 * 1000); // Add 1 minute to end time if they are the same
          }

          // Ensure each event has its own title and color array, avoid combining them
          const colorsArray =
            event.colors && event.colors.trim() !== ""
              ? event.colors.split(",").map((c) => c.trim())
              : ["#3174ad"];

          return {
            title: event.event_name, // Ensure each event has its own title
            start: localStartTime,
            end: localEndTime,
            colors: colorsArray, // Each event should have its own colors array
          };
        });

        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Custom function to apply dynamic solid color splits to the events
  const eventStyleGetter = (event) => {
    const colorsArray = event.colors;

    let backgroundColor;
    if (colorsArray.length === 2) {
      // Two colors: 50/50 split
      backgroundColor = `linear-gradient(to right, ${colorsArray[0]} 50%, ${colorsArray[1]} 50%)`;
    } else if (colorsArray.length === 3) {
      // Three colors: 33.33% split
      backgroundColor = `linear-gradient(to right, ${colorsArray[0]} 33.33%, ${colorsArray[1]} 33.33%, ${colorsArray[2]} 33.33%)`;
    } else {
      // Fallback to single color if only one color is provided
      backgroundColor = colorsArray[0] || "#3174ad";
    }

    // Check if colors array contains white or black for dynamic text color adjustment
    const containsWhite = colorsArray.some(
      (color) =>
        color.toLowerCase() === "#ffffff" || color.toLowerCase() === "white"
    );
    const containsBlack = colorsArray.some(
      (color) =>
        color.toLowerCase() === "#000000" || color.toLowerCase() === "black"
    );

    // Set text color based on the background
    let textColor = "#FFFFFF"; // Default neutral color
    if (containsWhite) {
      textColor = "black";
    } else if (containsBlack) {
      textColor = "white";
    } else if (colorsArray.includes("#9BDDFF")) {
      textColor = "black";
    } else if (colorsArray.includes("#A51C30")) {
      textColor = "white";
    }

    const style = {
      background: backgroundColor, // Apply the background (solid color or split)
      backgroundSize: "100% 100%", // Ensure full background coverage
      borderRadius: "5px",
      opacity: 0.8,
      color: textColor, // Set dynamic text color based on background
      border: "0px",
      display: "block",
      padding: "5px", // Add padding for better readability
      marginBottom: "5px", // Add margin to separate events visually
    };

    return { style };
  };

  return (
    <div>
      {events.length > 0 ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          eventPropGetter={eventStyleGetter} // Apply custom styles based on the color(s)
          dayLayoutAlgorithm="no-overlap" // Prevent overlapping events
          popup={true} // Enable "See more" popup for days with too many events
          components={{
            event: ({ event }) => (
              <div>
                <strong>{event.title}</strong>
                <p>{moment(event.start).format("HH:mm")}</p>
              </div>
            ),
            month: {
              event: ({ event }) => <span>{event.title}</span>, // Customize event rendering in month view
              showMore: true, // Show "See more" link when many events are present
            },
            // Custom event rendering for the popup with scrollable content and vertical layout
            popup: ({ event }) => (
              <div
                style={{
                  backgroundColor: event.colors[0], // Use the first color
                  border: "1px solid black", // Thin black border around events in the popup
                  borderRadius: "5px",
                  padding: "5px",
                  marginBottom: "5px", // Separate each event for better readability
                  color: "#FFF",
                  display: "block", // Ensure each event is rendered as a block element for vertical alignment
                }}
              >
                <strong>{event.title}</strong>
                <p>{moment(event.start).format("HH:mm")}</p>
              </div>
            ),
          }}
          style={{ height: 500 }}
          // Adjust the popup modal height and make it scrollable
          popupOffset={{ x: 30, y: 20 }} // Optional: Adjust popup offset
          popupProps={{
            style: {
              maxHeight: "400px", // Set a max height for the popup
              overflowY: "auto", // Enable vertical scrolling
              display: "block", // Ensure vertical layout for each event
            },
          }}
        />
      ) : (
        <p>Loading events...</p>
      )}
    </div>
  );
};

export default UserCalendar;
