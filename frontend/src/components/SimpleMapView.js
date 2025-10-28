import React, { useState } from "react";

function SimpleMapView({ mapResults }) {
  return (
    <div style={{ 
      backgroundColor: "white", 
      padding: "20px", 
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      height: "100%"
    }}>
      <h3>Map View</h3>
      {mapResults ? (
        <div style={{
          backgroundColor: "#e3f2fd",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "10px"
        }}>
          <p><strong>Type:</strong> {mapResults.type}</p>
          {mapResults.type === 'directions' && mapResults.data && (
            <div>
              <p><strong>From:</strong> {mapResults.data.start_address}</p>
              <p><strong>To:</strong> {mapResults.data.end_address}</p>
              <p><strong>Distance:</strong> {mapResults.data.distance}</p>
              <p><strong>Duration:</strong> {mapResults.data.duration}</p>
            </div>
          )}
        </div>
      ) : null}
      <div style={{ 
        width: "100%",
        height: "400px", 
        backgroundColor: "#f0f0f0", 
        border: "2px dashed #ccc",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666"
      }}>
        {mapResults ? (
          `Google Map would show ${mapResults.type} here`
        ) : (
          "Google Map placeholder - Click 'Test Route' to see data"
        )}
      </div>
    </div>
  );
}

export default SimpleMapView;
