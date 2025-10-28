# 🗺️ GoMapAiAsst - Google Maps AI Assistant

A modern web application that combines the power of Google's Gemini AI with Google Maps API to create an intelligent map assistant. Users can ask natural language questions about places, directions, and locations, and get interactive responses displayed on a beautiful map interface.

## ✨ Features

- 🤖 **AI-Powered Chat Interface**: Natural language queries powered by Google Gemini AI
- 🗺️ **Interactive Google Maps**: Real-time map visualization with markers and routes
- 🔍 **Places Search**: Find restaurants, hotels, hospitals, and other points of interest
- 🧭 **Turn-by-turn Directions**: Get detailed driving directions between any two locations
- 📍 **Geocoding**: Convert addresses to coordinates and vice versa
- 💬 **Modern Chat UI**: Beautiful, responsive chatbot interface with quick suggestions
- 🎯 **Smart Intent Detection**: AI automatically understands what type of query you're asking
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

```
GoMapAiAsst/
├── backend (Flask API)
│   ├── app.py              # Main Flask application
│   ├── env/                # Python virtual environment
│   └── requirements.txt    # Python dependencies
├── frontend (React App)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.js  # Chat interface component
│   │   │   └── MapView.js  # Google Maps component
│   │   ├── App.js          # Main React component
│   │   └── index.js        # React entry point
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- Google Cloud Account with:
  - Google Maps API key (with Maps JavaScript API, Places API, Directions API, Geocoding API enabled)
  - Google Gemini API key

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd GoMapAiAsst
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install Python dependencies
pip install flask flask-cors requests google-genai

# Update API keys in app.py
# Edit lines 11-12 in app.py:
GEMINI_API_KEY = "your-gemini-api-key-here"
GOOGLE_MAPS_API_KEY = "your-google-maps-api-key-here"

# Start the Flask server
python app.py
```

The backend will be running at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create .env file for Google Maps API key
echo "REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here" > .env
echo "REACT_APP_BACKEND_URL=http://127.0.0.1:5000" >> .env

# Start the React development server
npm start
```

The frontend will be running at `http://localhost:3000`

## 🔧 Configuration

### Google Cloud APIs Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API

3. **Create API Credentials**
   - Go to "Credentials" in the Google Cloud Console
   - Create an API key
   - Restrict the key to your required APIs and domains

4. **Get Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an API key for Gemini

### Environment Variables

**Backend (app.py):**
```python
GEMINI_API_KEY = "your-gemini-api-key"
GOOGLE_MAPS_API_KEY = "your-google-maps-api-key"
```

**Frontend (.env):**
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_BACKEND_URL=http://127.0.0.1:5000
```

## 💬 Usage Examples

### Places Search
- "Find restaurants near Kochi"
- "Show me hospitals in Mumbai"
- "Coffee shops around Times Square"

### Directions
- "Give me directions from Trivandrum to Kollam"
- "How to get from Mumbai to Pune?"
- "Route from my location to the nearest airport"

### Geocoding
- "Where is Eiffel Tower?"
- "Show me the coordinates of Sydney Opera House"
- "Find the address of latitude 28.6139, longitude 77.2090"

## 🎯 API Endpoints

### Backend API

**POST /ai_assistant**
```json
{
  "query": "Find restaurants near Kochi"
}
```

**Response:**
```json
{
  "intent": "places_search",
  "reply": "Found 20 restaurants near Kochi!",
  "places": [...],
  "mapData": {
    "type": "places",
    "data": [...]
  }
}
```

## 🛠️ Development

### Running in Development Mode

1. **Backend Development:**
   ```bash
   cd GoMapAiAsst
   source env/bin/activate
   python app.py  # Flask runs with debug=True
   ```

2. **Frontend Development:**
   ```bash
   cd frontend
   npm start  # React runs with hot reload
   ```

### Building for Production

```bash
# Frontend production build
cd frontend
npm run build

# Serve the built files with a static server
npx serve -s build -l 3000
```

## 🔍 Troubleshooting

### Common Issues

1. **Map not loading:**
   - Check if Google Maps API key is correctly set in `.env`
   - Ensure Maps JavaScript API is enabled in Google Cloud Console

2. **Directions not showing:**
   - Verify Directions API is enabled
   - Check browser console for API errors
   - Ensure both start and end locations are valid

3. **AI responses not working:**
   - Verify Gemini API key is correct in `app.py`
   - Check Flask server logs for errors

4. **CORS errors:**
   - Ensure Flask-CORS is installed and configured
   - Check that backend URL is correct in frontend `.env`

### Debug Mode

Enable debug logging in the browser console to see detailed API responses and map interactions.

## 📦 Dependencies

### Backend (Python)
- Flask 3.1.2 - Web framework
- Flask-CORS 6.0.1 - Cross-origin resource sharing
- requests - HTTP library
- google-genai - Google Gemini AI client

### Frontend (React)
- React 18+ - UI framework
- @react-google-maps/api - Google Maps integration
- Modern CSS with inline styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Maps API for location services
- Google Gemini AI for natural language processing
- React and Flask communities for excellent documentation
- All contributors who help improve this project

---

**Built with ❤️ using React, Flask, Google Maps API, and Google Gemini AI**
