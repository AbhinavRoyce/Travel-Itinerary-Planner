"""
Smart Travel Itinerary Planner — Flask Backend
================================================
Install: pip install flask flask-cors
Run:     python app.py
API:     POST /api/itinerary  →  returns itinerary JSON
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app) 


PREF_TYPES = {
    "adventure":   ["Adventure", "Outdoor", "Sports"],
    "food":        ["Food", "Restaurant", "Market"],
    "culture":     ["Culture", "Museum", "Heritage"],
    "relaxation":  ["Relaxation", "Spa", "Park"],
    "nightlife":   ["Nightlife", "Bar", "Club"],
    "shopping":    ["Shopping", "Market"],
}

ACTIVITY_TEMPLATES = [
    {"name": "Morning Exploration Walk",    "type": "Culture",     "duration": "1.5 hrs",  "note": "Discover the local neighborhood at your own pace.", "cost": "Free"},
    {"name": "Local Street Food Tour",      "type": "Food",        "duration": "2 hrs",    "note": "Sample authentic local cuisine from street vendors.", "cost": "$15–25/person"},
    {"name": "Historical District Visit",   "type": "Culture",     "duration": "2.5 hrs",  "note": "Explore the historic heart of the city.", "cost": "$10–20/person"},
    {"name": "City Viewpoint & Sunset",     "type": "Relaxation",  "duration": "1 hr",     "note": "Perfect golden hour views of the skyline.", "cost": "Free"},
    {"name": "Local Cooking Class",         "type": "Food",        "duration": "3 hrs",    "note": "Learn to cook traditional dishes from a local chef.", "cost": "$45–65/person"},
    {"name": "Adventure Activity",          "type": "Adventure",   "duration": "3 hrs",    "note": "An exciting outdoor activity suited for your group.", "cost": "$30–50/person"},
    {"name": "Museum or Gallery Visit",     "type": "Culture",     "duration": "2 hrs",    "note": "Explore local art, history, and culture.", "cost": "$12–18/person"},
    {"name": "Spa & Wellness Session",      "type": "Relaxation",  "duration": "2 hrs",    "note": "Relax and recharge at a local wellness center.", "cost": "$40–80/person"},
    {"name": "Night Market Exploration",    "type": "Nightlife",   "duration": "2 hrs",    "note": "Browse vibrant stalls, food, and local crafts after dark.", "cost": "$20–30/person"},
    {"name": "Day Trip to Nearby Attraction","type": "Adventure",  "duration": "Full day", "note": "Explore a nearby natural wonder or historic site.", "cost": "$30–60/person"},
    {"name": "Traditional Show or Performance","type": "Culture",  "duration": "2 hrs",    "note": "Enjoy a local performance, dance, or cultural show.", "cost": "$25–40/person"},
    {"name": "Shopping District Stroll",    "type": "Shopping",    "duration": "2.5 hrs",  "note": "Browse local boutiques, markets, and souvenir shops.", "cost": "Variable"},
    {"name": "Rooftop Bar Experience",      "type": "Nightlife",   "duration": "2 hrs",    "note": "Enjoy craft cocktails with panoramic city views.", "cost": "$30–50/person"},
    {"name": "Botanical Garden Walk",       "type": "Relaxation",  "duration": "1.5 hrs",  "note": "Peaceful stroll through beautifully manicured gardens.", "cost": "$5–10/person"},
    {"name": "Local Breakfast Café",        "type": "Food",        "duration": "1 hr",     "note": "Start the day with local breakfast favorites.", "cost": "$10–15/person"},
]

TIMES = ["08:00", "09:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"]

DAY_LABELS = [
    "Arrival & First Impressions", "Into the Heart of the City",
    "Culture & Cuisine Day", "Adventure & Discovery",
    "Local Life & Hidden Gems", "Panoramas & Markets",
    "Relaxation & Reflection", "Final Memories", "Farewell Day"
]


def build_day(day_num: int, date: datetime, preferences: list) -> dict:
    """Build one day's itinerary."""
    activities_per_day = random.randint(3, 5)
    times = sorted(random.sample(TIMES, activities_per_day))
    activities = []

    pref_types = []
    for p in preferences:
        pref_types.extend(PREF_TYPES.get(p, []))

    for i, time in enumerate(times):
        if pref_types and random.random() < 0.7:
            preferred = [a for a in ACTIVITY_TEMPLATES if a["type"] in pref_types]
            template = random.choice(preferred) if preferred else random.choice(ACTIVITY_TEMPLATES)
        else:
            template = random.choice(ACTIVITY_TEMPLATES)

        activities.append({
            "time":     time,
            "name":     template["name"],
            "type":     template["type"],
            "duration": template["duration"],
            "note":     template["note"],
            "cost":     template["cost"],
        })

    return {
        "day":        day_num,
        "date":       date.strftime("%b %d"),
        "label":      DAY_LABELS[(day_num - 1) % len(DAY_LABELS)],
        "activities": activities,
    }


@app.route("/api/itinerary", methods=["POST"])
def generate_itinerary():
    """
    POST /api/itinerary
    Body: {
      destination, startDate, endDate, budget, travelers, preferences
    }
    Returns: Itinerary JSON
    """
    data = request.get_json(force=True)

    destination = data.get("destination", "Your Destination")
    start_str   = data.get("startDate", "")
    end_str     = data.get("endDate", "")
    budget      = float(data.get("budget", 2000))
    travelers   = int(data.get("travelers", 2))
    preferences = data.get("preferences", [])

    try:
        start_date = datetime.strptime(start_str, "%Y-%m-%d")
        end_date   = datetime.strptime(end_str,   "%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    num_days = max(1, (end_date - start_date).days + 1)
    if num_days > 30:
        return jsonify({"error": "Maximum trip duration is 30 days."}), 400

    # Build itinerary
    days = []
    for i in range(num_days):
        day_date = start_date + timedelta(days=i)
        days.append(build_day(i + 1, day_date, preferences))

    return jsonify({
        "destination": destination,
        "startDate":   start_str,
        "endDate":     end_str,
        "budget":      budget,
        "travelers":   travelers,
        "preferences": preferences,
        "days":        days,
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "Smart Travel Itinerary Planner"})


if __name__ == "__main__":
    print("🌍 Travel Planner API running at http://localhost:5000")
    app.run(debug=True, port=5000)
