# ✦ Smart Travel Itinerary Planner

A modern, AI-powered travel planning app with a Python backend and a luxury-editorial frontend.

---

## 📂 Folder Structure

```
travel-planner/
├── index.html          # Main single-page app shell
├── app.py              # Python Flask backend (API)
├── requirements.txt    # Python dependencies
├── css/
│   └── style.css       # All styles (dark luxury theme)
└── js/
    ├── data.js         # Demo/mock itinerary data
    └── app.js          # App logic + API integration
```

---

## 🚀 Quick Start

### 1 — Backend (Python / Flask)

```bash
cd travel-planner
pip install flask flask-cors
python app.py
# → API running at http://localhost:5000
```

### 2 — Frontend

Open `index.html` in your browser directly, or serve it:

```bash
# Python simple server
python -m http.server 3000
# → Open http://localhost:3000
```

> **Without the backend running**, the app automatically falls back to demo data so you can always preview the full UI.

---

## 🔌 API Reference

### `POST /api/itinerary`

**Request Body:**
```json
{
  "destination": "Paris, France",
  "startDate":   "2025-06-01",
  "endDate":     "2025-06-07",
  "budget":      3500,
  "travelers":   2,
  "preferences": ["culture", "food", "relaxation"]
}
```

**Response:**
```json
{
  "destination": "Paris, France",
  "startDate": "2025-06-01",
  "endDate": "2025-06-07",
  "budget": 3500,
  "travelers": 2,
  "preferences": ["culture", "food", "relaxation"],
  "days": [
    {
      "day": 1,
      "date": "Jun 01",
      "label": "Arrival & First Impressions",
      "activities": [
        {
          "time": "10:00",
          "name": "Historical District Visit",
          "type": "Culture",
          "duration": "2.5 hrs",
          "note": "Explore the historic heart of the city.",
          "cost": "$10–20/person"
        }
      ]
    }
  ]
}
```

### `GET /api/health`
Returns `{ "status": "ok" }`.

---

## 🎨 Design System

| Token        | Value           | Use                   |
|-------------|-----------------|----------------------|
| `--bg`       | `#0e0f14`       | Page background       |
| `--card`     | `#16171f`       | Card backgrounds      |
| `--accent`   | `#c8a96e`       | Gold — primary accent |
| `--secondary`| `#7eb8d4`       | Blue — secondary      |
| `--text`     | `#f0ede8`       | Primary text          |
| Font Display | Cormorant Garamond | Headings            |
| Font Body    | DM Sans         | UI elements           |

---

## 🗺️ Map Integration

The map section is ready for real map integration. To add Google Maps or Mapbox:

```javascript
// In js/app.js — replace map placeholder with:
const map = new mapboxgl.Map({
  container: 'mapPlaceholder',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [lng, lat],
  zoom: 12
});
```

---

## 🔧 Extending the Backend

To connect an AI model (e.g., OpenAI / Claude) for real itinerary generation:

```python
# In app.py — replace build_day() with an AI call:
import anthropic

client = anthropic.Anthropic(api_key="your-key")

def generate_with_ai(destination, days, preferences):
    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Create a {days}-day itinerary for {destination}. Preferences: {preferences}. Return JSON."
        }]
    )
    return message.content[0].text
```
