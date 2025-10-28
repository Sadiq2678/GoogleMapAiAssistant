// Demo data structure for testing frontend without backend
export const demoResponses = {
  places: {
    type: 'places',
    data: [
      {
        name: "Restaurant ABC",
        geometry: {
          location: {
            lat: 9.9312,
            lng: 76.2673
          }
        },
        vicinity: "Marine Drive, Kochi",
        rating: 4.5,
        price_level: 2,
        opening_hours: {
          open_now: true
        }
      },
      {
        name: "Coffee Shop XYZ",
        geometry: {
          location: {
            lat: 9.9412,
            lng: 76.2773
          }
        },
        vicinity: "MG Road, Kochi",
        rating: 4.2,
        price_level: 1,
        opening_hours: {
          open_now: false
        }
      }
    ]
  },
  
  directions: {
    type: 'directions',
    data: {
      start_address: "Kochi Airport",
      end_address: "Marine Drive, Kochi",
      distance: "12.5 km",
      duration: "25 minutes",
      start_location: { lat: 10.0312, lng: 76.2673 },
      end_location: { lat: 9.9312, lng: 76.2673 },
      steps: [
        { instruction: "Head south on Airport Road", distance: "2.1 km" },
        { instruction: "Turn right onto NH 66", distance: "8.4 km" },
        { instruction: "Turn left onto Marine Drive", distance: "2.0 km" }
      ]
    }
  },
  
  geocode: {
    type: 'geocode',
    data: [
      {
        formatted_address: "Marine Drive, Kochi, Kerala, India",
        latitude: 9.9312,
        longitude: 76.2673
      }
    ]
  }
};
