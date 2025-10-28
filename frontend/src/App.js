import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import MapView from "./components/MapView";

function App() {
  const [mapResults, setMapResults] = useState(null);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #e2e8f0"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 20px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #3B82F6, #10B981)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px"
                }}>🗺️</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: 0
                }}>GoMap AI Assistant</h1>
                <p style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  margin: "2px 0 0 0"
                }}>Your intelligent map companion</p>
              </div>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "14px",
              color: "#6b7280"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%"
                }}></div>
                <span>AI Assistant Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          gap: "24px",
          height: "calc(100vh - 140px)"
        }}>
          {/* Chat Section */}
          <div style={{
            width: window.innerWidth < 768 ? "100%" : "33%",
            minWidth: "320px"
          }}>
            <ChatBox setMapResults={setMapResults} />
          </div>
          
          {/* Map Section */}
          <div style={{
            width: window.innerWidth < 768 ? "100%" : "67%",
            minWidth: "400px"
          }}>
            <MapView mapResults={mapResults} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
