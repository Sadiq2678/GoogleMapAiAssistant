import React from "react";

function TestApp() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>GoMap AI Assistant - Test Mode</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        width: "300px", 
        height: "200px", 
        backgroundColor: "#f0f0f0", 
        border: "1px solid #ccc",
        padding: "10px",
        marginTop: "20px"
      }}>
        Chat Box Area
      </div>
      <div style={{ 
        width: "500px", 
        height: "300px", 
        backgroundColor: "#e0f7fa", 
        border: "1px solid #ccc",
        padding: "10px",
        marginTop: "20px"
      }}>
        Map Area
      </div>
    </div>
  );
}

export default TestApp;
