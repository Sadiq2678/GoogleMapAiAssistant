import React, { useState } from "react";
import SimpleChatBox from "./components/SimpleChatBox";
import SimpleMapView from "./components/SimpleMapView";

function App() {
  const [mapResults, setMapResults] = useState(null);

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: "white", 
        padding: "20px", 
        marginBottom: "20px", 
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ margin: 0, color: "#333" }}>GoMap AI Assistant</h1>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>Your intelligent map companion</p>
      </header>

      {/* Main Content */}
      <main style={{ display: "flex", gap: "20px", height: "70vh" }}>
        {/* Chat Section */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <SimpleChatBox setMapResults={setMapResults} />
        </div>
        
        {/* Map Section */}
        <div style={{ flex: "2", minWidth: "400px" }}>
          <SimpleMapView mapResults={mapResults} />
        </div>
      </main>
    </div>
  );
}

export default App;
