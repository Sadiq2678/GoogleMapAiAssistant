import React, { useState, useEffect, useCallback } from "react";
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow,
  DirectionsRenderer
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "20px",
};

function MapView({ mapResults }) {
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 9.9312, lng: 76.2673 }); // default Kochi
  const [mapZoom, setMapZoom] = useState(12);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Calculate route using Google Maps DirectionsService
  const calculateRoute = useCallback(async (origin, destination) => {
    if (!window.google || !window.google.maps) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(result);
      setMapZoom(10); // Zoom out to see the full route
    } catch (error) {
      console.error('Error calculating route:', error);
      // Fallback to showing start and end markers
      setMapCenter(origin);
      setMapZoom(12);
    }
  }, []);

  // Handle different types of map results
  useEffect(() => {
    if (!mapResults || !mapResults.data) {
      // Clear directions when no results
      setDirectionsResponse(null);
      return;
    }

    const { type, data } = mapResults;

    // Clear directions when switching to non-direction types
    if (type !== 'directions') {
      setDirectionsResponse(null);
    }

    switch (type) {
      case 'places':
        if (data && data.length > 0) {
          const firstPlace = data[0];
          const lat = firstPlace.geometry?.location?.lat || firstPlace.lat;
          const lng = firstPlace.geometry?.location?.lng || firstPlace.lng;
          
          if (lat && lng) {
            setMapCenter({ lat, lng });
            setMapZoom(14);
          }
        }
        break;

      case 'geocode':
        if (data && data.length > 0) {
          const location = data[0];
          setMapCenter({ 
            lat: location.latitude || location.lat, 
            lng: location.longitude || location.lng 
          });
          setMapZoom(15);
        }
        break;

      case 'directions':
        if (data && data.start_location && data.end_location) {
          // Calculate and display route using DirectionsService
          calculateRoute(data.start_location, data.end_location);
        }
        break;

      default:
        break;
    }
  }, [mapResults, calculateRoute]);

  const renderMarkers = () => {
    if (!mapResults || !mapResults.data) return null;

    const { type, data } = mapResults;

    if (type === 'places' && data) {
      return data.map((place, i) => {
        const lat = place.geometry?.location?.lat || place.lat;
        const lng = place.geometry?.location?.lng || place.lng;
        
        if (!lat || !lng) return null;

        return (
          <Marker
            key={`place-${i}`}
            position={{ lat, lng }}
            onClick={() => setSelected(place)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40)
            }}
          />
        );
      });
    }

    if (type === 'geocode' && data) {
      return data.map((location, i) => (
        <Marker
          key={`geocode-${i}`}
          position={{
            lat: location.latitude || location.lat,
            lng: location.longitude || location.lng,
          }}
          onClick={() => setSelected(location)}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(40, 40)
          }}
        />
      ));
    }

    return null;
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "1px solid #e5e7eb",
      overflow: "hidden"
    }}>
      {/* Map Header */}
      <div style={{
        padding: "16px",
        background: "linear-gradient(135deg, #059669, #047857)",
        color: "white"
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
              width: "32px",
              height: "32px",
              backgroundColor: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{
                color: "#059669",
                fontWeight: "bold"
              }}>📍</span>
            </div>
            <h3 style={{
              fontWeight: "600",
              fontSize: "18px",
              margin: 0
            }}>Interactive Map</h3>
          </div>
          {mapResults && (
            <div style={{
              fontSize: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              padding: "4px 12px",
              borderRadius: "20px"
            }}>
              {mapResults.type === 'places' && `${mapResults.data?.length || 0} places found`}
              {mapResults.type === 'directions' && (
                directionsResponse 
                  ? `Route: ${mapResults.data?.distance || 'Calculated'} • ${mapResults.data?.duration || 'Estimated'}` 
                  : 'Calculating route...'
              )}
              {mapResults.type === 'geocode' && 'Location marked'}
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: "relative" }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap 
            mapContainerStyle={containerStyle} 
            center={mapCenter} 
            zoom={mapZoom}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ],
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            }}
          >
            {/* Render markers for places and geocoding (only when not showing directions) */}
            {mapResults?.type !== 'directions' && renderMarkers()}

            {/* Render directions with full route visualization */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  suppressMarkers: false,
                  polylineOptions: {
                    strokeColor: "#2563eb",
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                  },
                  markerOptions: {
                    startMarkerOptions: {
                      icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40)
                      }
                    },
                    endMarkerOptions: {
                      icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40)
                      }
                    }
                  }
                }}
              />
            )}

            {/* Fallback markers for directions when route calculation fails */}
            {mapResults?.type === 'directions' && !directionsResponse && mapResults.data && (
              <>
                {mapResults.data.start_location && (
                  <Marker
                    position={mapResults.data.start_location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    title="Start Location"
                  />
                )}
                {mapResults.data.end_location && (
                  <Marker
                    position={mapResults.data.end_location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40)
                    }}
                    title="End Location"
                  />
                )}
              </>
            )}

            {/* Info Window */}
            {selected && (
              <InfoWindow
                position={{
                  lat: selected.geometry?.location?.lat || selected.latitude || selected.lat,
                  lng: selected.geometry?.location?.lng || selected.longitude || selected.lng,
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div style={{
                  padding: "8px",
                  maxWidth: "280px"
                }}>
                  <h3 style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#1f2937",
                    marginBottom: "8px",
                    margin: "0 0 8px 0"
                  }}>
                    {selected.name || "Location"}
                  </h3>
                  {selected.formatted_address && (
                    <p style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      margin: "0 0 8px 0"
                    }}>
                      📍 {selected.formatted_address}
                    </p>
                  )}
                  {selected.vicinity && (
                    <p style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      margin: "0 0 8px 0"
                    }}>
                      📍 {selected.vicinity}
                    </p>
                  )}
                  {selected.rating && (
                    <p style={{
                      fontSize: "14px",
                      color: "#d97706",
                      marginBottom: "4px",
                      margin: "0 0 4px 0"
                    }}>
                      ⭐ {selected.rating}/5
                    </p>
                  )}
                  {selected.price_level && (
                    <p style={{
                      fontSize: "14px",
                      color: "#059669",
                      marginBottom: "4px",
                      margin: "0 0 4px 0"
                    }}>
                      💰 {selected.price_level}/4 price level
                    </p>
                  )}
                  {selected.opening_hours?.open_now !== undefined && (
                    <p style={{
                      fontSize: "14px",
                      marginBottom: "4px",
                      margin: "0 0 4px 0",
                      color: selected.opening_hours.open_now ? "#059669" : "#dc2626"
                    }}>
                      {selected.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        {/* Map overlay for no results */}
        {!mapResults && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "36px",
                marginBottom: "12px"
              }}>🗺️</div>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "8px",
                margin: "0 0 8px 0"
              }}>
                Ready to explore!
              </h3>
              <p style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: 0
              }}>
                Ask the assistant about places or directions to see them on the map
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(MapView);
