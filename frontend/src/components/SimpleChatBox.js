import React, { useState } from "react";

function SimpleChatBox({ setMapResults }) {
  const [query, setQuery] = useState("");

  const testRoute = () => {
    if (setMapResults) {
      setMapResults({
        type: 'directions',
        data: {
          start_address: "Kochi Airport",
          end_address: "Marine Drive, Kochi",
          distance: "12.5 km",
          duration: "25 minutes",
          start_location: { lat: 10.0312, lng: 76.2673 },
          end_location: { lat: 9.9312, lng: 76.2673 }
        }
      });
    }
  };

  return (
    <div style={{ 
      backgroundColor: "white", 
      padding: "20px", 
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      height: "100%"
    }}>
      <h3>Chat Assistant</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me about places or directions..."
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px"
          }}
        />
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Send
        </button>
        <button
          onClick={testRoute}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Test Route
        </button>
      </div>
      <div style={{ 
        height: "300px", 
        backgroundColor: "#f8f9fa", 
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #dee2e6"
      }}>
        <p>Chat messages will appear here...</p>
      </div>
    </div>
  );
}

export default SimpleChatBox;
