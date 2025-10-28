from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from google import genai
import os

app = Flask(__name__)
CORS(app)

# --- 🔑 API Keys ---
GEMINI_API_KEY = "AIzaSyBlURdl_x66RSPRAU1vcHLcGUyfE9sQVZ0"
GOOGLE_MAPS_API_KEY = "AIzaSyDm0P0EWwt6kPrrFVsDx2rodcKbBMDZzFQ"

# --- 🤖 Initialize Gemini Client ---
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.5-flash-preview-05-20"

@app.route("/ai_assistant", methods=["POST"])
def ai_assistant():
    try:
        data = request.json
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field"}), 400

        user_query = data["query"]

        # --- Ask Gemini to interpret the query ---
        prompt = f"""
        You are a Google Maps AI Assistant. 
        The user asked: "{user_query}"

        Classify this query as one of the following:
        1. 'places_search' - if the user wants to find nearby locations (like restaurants, cafes, hospitals)
        2. 'directions' - if the user wants directions or a route between two places
        3. 'geocode' - if the user wants to know coordinates or address info
        4. 'general' - if it's a general question not needing a Maps API call

        Return ONLY the classification word.
        """

        chat = client.chats.create(model=MODEL_NAME)
        intent_response = chat.send_message(prompt)
        intent = intent_response.text.strip().lower()

        # --- Handle intent ---
        if "place" in intent:
            # Places search
            try:
                location = data.get("location", "")
                places_result = search_places(user_query, location)
                if places_result and len(places_result) > 0:
                    return jsonify({
                        "intent": "places_search",
                        "places": places_result,
                        "reply": f"Found {len(places_result)} places matching your search.",
                        "suggestions": [{
                            "type": "places_search",
                            "message": "Click on any place to see it on the map!"
                        }]
                    })
                else:
                    return jsonify({
                        "intent": "places_search",
                        "reply": "Sorry, I couldn't find any places matching your search. Try a different location or search term."
                    })
            except Exception as e:
                return jsonify({
                    "intent": "places_search",
                    "reply": f"Error searching for places: {str(e)}"
                })

        elif "direction" in intent:
            # Extract origin and destination from query if not provided
            origin = data.get("origin", "")
            destination = data.get("destination", "")
            
            # Try to extract locations from the query using AI if not provided
            if not origin or not destination:
                extraction_prompt = f"""
                Extract the origin and destination from this directions query: "{user_query}"
                
                Return in this exact format:
                Origin: [location name]
                Destination: [location name]
                
                If you can't find both locations, return "Not found"
                """
                
                extraction_chat = client.chats.create(model=MODEL_NAME)
                extraction_response = extraction_chat.send_message(extraction_prompt)
                extraction_text = extraction_response.text.strip()
                
                if "Not found" not in extraction_text:
                    lines = extraction_text.split('\n')
                    for line in lines:
                        if line.startswith('Origin:'):
                            origin = line.replace('Origin:', '').strip()
                        elif line.startswith('Destination:'):
                            destination = line.replace('Destination:', '').strip()
            
            if not origin or not destination:
                return jsonify({
                    "intent": "directions",
                    "reply": "I need both origin and destination to provide directions. Please specify where you want to go from and to. For example: 'How to get from Kochi to Trivandrum?'"
                })
            
            try:
                directions_result = get_directions(origin, destination)
                if "error" in directions_result:
                    return jsonify({
                        "intent": "directions",
                        "reply": f"Sorry, I couldn't find directions: {directions_result['error']}"
                    })
                else:
                    return jsonify({
                        "intent": "directions",
                        "directions": directions_result,
                        "reply": f"Found route from {origin} to {destination}",
                        "suggestions": [{
                            "type": "directions",
                            "message": "Route displayed on map with turn-by-turn directions!"
                        }]
                    })
            except Exception as e:
                return jsonify({
                    "intent": "directions",
                    "reply": f"Error getting directions: {str(e)}"
                })

        elif "geocode" in intent:
            try:
                geocode_result = geocode(user_query)
                if "error" in geocode_result:
                    return jsonify({
                        "intent": "geocode",
                        "reply": f"Sorry, I couldn't find that location: {geocode_result['error']}"
                    })
                else:
                    return jsonify({
                        "intent": "geocode",
                        "locations": [geocode_result],
                        "reply": f"Found location: {geocode_result['address']}",
                        "suggestions": [{
                            "type": "geocode",
                            "message": "Location marked on the map!"
                        }]
                    })
            except Exception as e:
                return jsonify({
                    "intent": "geocode",
                    "reply": f"Error finding location: {str(e)}"
                })

        else:
            # General chat (not map-related)
            try:
                # Create a new chat for the actual response (not classification)
                response_chat = client.chats.create(model=MODEL_NAME)
                response = response_chat.send_message(user_query)
                return jsonify({
                    "intent": "general", 
                    "reply": response.text,
                    "suggestions": [{
                        "type": "general",
                        "message": "Ask me about places, directions, or locations for map features!"
                    }]
                })
            except Exception as e:
                return jsonify({
                    "intent": "general",
                    "reply": "Hello! I'm your Google Maps AI Assistant. I can help you find places, get directions, and answer questions about locations. How can I help you today?"
                })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Google Maps Helper Functions ---

def search_places(query, location=""):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {"query": query, "key": GOOGLE_MAPS_API_KEY}
    if location:
        params["location"] = location
        params["radius"] = 50000
    res = requests.get(url, params=params)
    results = res.json().get("results", [])
    return [{
        "name": r.get("name"),
        "address": r.get("formatted_address"),
        "rating": r.get("rating"),
        "location": r.get("geometry", {}).get("location")
    } for r in results[:5]]


def get_directions(origin, destination):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": origin,
        "destination": destination,
        "mode": "driving",
        "key": GOOGLE_MAPS_API_KEY
    }
    res = requests.get(url, params=params)
    data = res.json()
    if data["status"] != "OK":
        return {"error": data["status"]}
    
    route = data["routes"][0]
    leg = route["legs"][0]
    
    return {
        "distance": leg["distance"]["text"],
        "duration": leg["duration"]["text"],
        "start_address": leg["start_address"],
        "end_address": leg["end_address"],
        "steps": [
            {
                "instruction": step["html_instructions"].replace("<b>", "").replace("</b>", ""),
                "distance": step["distance"]["text"],
                "duration": step["duration"]["text"]
            }
            for step in leg["steps"]
        ],
        "polyline": route.get("overview_polyline", {}).get("points")
    }


def geocode(address):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": address, "key": GOOGLE_MAPS_API_KEY}
    res = requests.get(url, params=params)
    results = res.json().get("results", [])
    if not results:
        return {"error": "No results"}
    loc = results[0]["geometry"]["location"]
    return {
        "address": results[0]["formatted_address"],
        "lat": loc["lat"],
        "lng": loc["lng"]
    }


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🗺️ Google Map AI Assistant running!",
        "usage": {
            "POST /ai_assistant": {
                "query": "Find restaurants near Kochi",
                "origin": "Kochi",
                "destination": "Trivandrum"
            }
        }
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
