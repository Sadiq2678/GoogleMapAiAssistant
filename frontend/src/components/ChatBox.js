import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function ChatBox({ setMapResults }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm your map assistant. Ask me about places, get directions, or find locations. For example: 'Find restaurants near me' or 'Directions to the airport'",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendQuery = async () => {
    if (!query.trim() || isLoading) return;

    const userMessage = { 
      sender: "user", 
      text: query.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = query.trim();
    setQuery("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ai_assistant`, {
        query: currentQuery,
      });

      const data = res.data;
      console.log('AI Assistant Response:', data); // Debug log
      
      let reply = "I'm not sure about that.";
      
      // Handle different response types
      if (data.reply) {
        reply = data.reply;
      }
      
      // Handle places search results
      if (data.places && data.places.length > 0) {
        reply = `Found ${data.places.length} places:\n\n`;
        data.places.slice(0, 3).forEach((place, index) => {
          reply += `${index + 1}. ${place.name}\n`;
          if (place.address) reply += `   📍 ${place.address}\n`;
          if (place.rating) reply += `   ⭐ ${place.rating}/5\n`;
          reply += '\n';
        });
        
        // Update map with places
        if (setMapResults) {
          setMapResults({
            type: 'places',
            data: data.places
          });
        }
      }
      
      // Handle directions results
      if (data.directions) {
        const dir = data.directions;
        reply = `🗺️ Route from ${dir.start_address} to ${dir.end_address}\n\n`;
        reply += `📏 Distance: ${dir.distance}\n`;
        reply += `⏱️ Duration: ${dir.duration}\n\n`;
        
        if (dir.steps && dir.steps.length > 0) {
          reply += "Turn-by-turn directions:\n";
          dir.steps.slice(0, 5).forEach((step, index) => {
            reply += `${index + 1}. ${step.instruction} (${step.distance})\n`;
          });
        }
        
        // Update map with route
        if (setMapResults) {
          setMapResults({
            type: 'directions',
            data: data.directions
          });
        }
      }
      
      // Handle geocoding results
      if (data.locations && data.locations.length > 0) {
        const location = data.locations[0];
        reply = `📍 Location found:\n`;
        reply += `Address: ${location.formatted_address}\n`;
        reply += `Coordinates: ${location.latitude}, ${location.longitude}`;
        
        // Update map with location
        if (setMapResults) {
          setMapResults({
            type: 'geocode',
            data: data.locations
          });
        }
      }
      
      // Handle suggestions
      if (data.suggestions && data.suggestions.length > 0) {
        reply += '\n\n💡 Suggestions:\n';
        data.suggestions.forEach(suggestion => {
          reply += `• ${suggestion.message}\n`;
        });
      }

      setMessages((prev) => [...prev, { 
        sender: "ai", 
        text: reply,
        timestamp: new Date()
      }]);
      
    } catch (err) {
      console.error('Error calling AI assistant:', err);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "ai", 
          text: "Sorry, something went wrong. Please try again.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "1px solid #e5e7eb"
    }}>
      {/* Chat Header */}
      <div style={{
        padding: "16px",
        background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        borderTopLeftRadius: "16px",
        borderTopRightRadius: "16px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            backgroundColor: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{
              color: "#3B82F6",
              fontWeight: "bold",
              fontSize: "18px"
            }}>🗺️</span>
          </div>
          <div>
            <h3 style={{
              color: "white",
              fontWeight: "600",
              fontSize: "18px",
              margin: 0
            }}>Map Assistant</h3>
            <p style={{
              color: "#DBEAFE",
              fontSize: "14px",
              margin: "2px 0 0 0"
            }}>Your AI-powered navigation guide</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        backgroundColor: "#f9fafb"
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "16px"
            }}
          >
            <div style={{
              maxWidth: "320px",
              padding: "12px 16px",
              borderRadius: "16px",
              backgroundColor: msg.sender === "user" ? "#3B82F6" : "white",
              color: msg.sender === "user" ? "white" : "#374151",
              boxShadow: msg.sender === "user" ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: msg.sender === "user" ? "none" : "1px solid #e5e7eb",
              borderBottomRightRadius: msg.sender === "user" ? "4px" : "16px",
              borderBottomLeftRadius: msg.sender === "user" ? "16px" : "4px"
            }}>
              <div style={{
                fontSize: "14px",
                lineHeight: "1.5",
                whiteSpace: "pre-line"
              }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: "12px",
                marginTop: "8px",
                color: msg.sender === "user" ? "#DBEAFE" : "#6b7280"
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              backgroundColor: "white",
              color: "#374151",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              borderBottomLeftRadius: "4px",
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              maxWidth: "160px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#9ca3af",
                    borderRadius: "50%",
                    animation: "bounce 1s infinite"
                  }}></div>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#9ca3af",
                    borderRadius: "50%",
                    animation: "bounce 1s infinite 0.1s"
                  }}></div>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#9ca3af",
                    borderRadius: "50%",
                    animation: "bounce 1s infinite 0.2s"
                  }}></div>
                </div>
                <span style={{
                  fontSize: "14px",
                  color: "#6b7280"
                }}>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "white",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px"
      }}>
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuery()}
            placeholder="Ask about places, directions, or locations..."
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              outline: "none",
              fontSize: "14px",
              transition: "all 0.2s",
              backgroundColor: isLoading ? "#f3f4f6" : "white"
            }}
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = "#3B82F6";
              e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={sendQuery}
            disabled={isLoading || !query.trim()}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: "500",
              fontSize: "14px",
              border: "none",
              cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
              backgroundColor: isLoading || !query.trim() ? "#d1d5db" : "#3B82F6",
              color: isLoading || !query.trim() ? "#6b7280" : "white",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              if (!isLoading && query.trim()) {
                e.target.style.backgroundColor = "#1D4ED8";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && query.trim()) {
                e.target.style.backgroundColor = "#3B82F6";
              }
            }}
          >
            {isLoading ? (
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid white",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
            ) : (
              "Send"
            )}
          </button>
        </div>
        
        {/* Quick suggestions */}
        <div style={{
          marginTop: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px"
        }}>
          {messages.length <= 1 && (
            <>
              <button
                onClick={() => setQuery("Find restaurants near me")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "20px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#f3f4f6";
                }}
              >
                Find restaurants
              </button>
              <button
                onClick={() => setQuery("Get directions to airport")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "20px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#f3f4f6";
                }}
              >
                Get directions
              </button>
              <button
                onClick={() => setQuery("Show me gas stations nearby")}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "20px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#f3f4f6";
                }}
              >
                Find gas stations
              </button>
              <button
                onClick={() => {
                  // Test directions without backend
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
                  setMessages(prev => [...prev, {
                    sender: "ai",
                    text: "🗺️ Showing test route from Kochi Airport to Marine Drive",
                    timestamp: new Date()
                  }]);
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  border: "none",
                  borderRadius: "20px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#bfdbfe";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.backgroundColor = "#dbeafe";
                }}
              >
                Test Route
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
