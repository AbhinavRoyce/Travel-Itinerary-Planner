const DEMO_ITINERARIES = {
  default: {
    destination: "Tokyo, Japan",
    startDate: "2025-05-10",
    endDate: "2025-05-16",
    budget: 3000,
    travelers: 2,
    preferences: ["culture", "food", "adventure"],
    days: [
      {
        day: 1,
        label: "Arrival & Shibuya",
        activities: [
          { time: "14:00", name: "Check-in at Hotel Gracery Shinjuku", type: "Hotel", duration: "1 hr", note: "Great location near Kabukicho with stunning city views.", cost: "$180/night" },
          { time: "16:00", name: "Shibuya Crossing", type: "Landmark", duration: "45 min", note: "Witness the world's busiest pedestrian crossing at rush hour — extraordinary energy.", cost: "Free" },
          { time: "17:30", name: "Shibuya Sky Observation Deck", type: "Attraction", duration: "1.5 hrs", note: "Sunset views over the entire Tokyo skyline. Book tickets in advance.", cost: "$18/person" },
          { time: "20:00", name: "Dinner at Ichiran Ramen", type: "Food", duration: "1 hr", note: "Famous solo-booth ramen experience. The tonkotsu broth is legendary.", cost: "$15/person" }
        ]
      },
      {
        day: 2,
        label: "Temples & Asakusa",
        activities: [
          { time: "08:00", name: "Senso-ji Temple", type: "Culture", duration: "2 hrs", note: "Arrive early to avoid crowds. Walk through Nakamise-dori shopping street.", cost: "Free" },
          { time: "11:00", name: "Asakusa Culture Center", type: "Culture", duration: "1 hr", note: "Traditional arts and crafts exhibitions. Tea ceremony demonstration available.", cost: "$8/person" },
          { time: "13:00", name: "Lunch at Sometaro", type: "Food", duration: "1.5 hrs", note: "Cook your own okonomiyaki — a must-try savory Japanese pancake experience.", cost: "$20/person" },
          { time: "15:30", name: "Akihabara Electric Town", type: "Adventure", duration: "3 hrs", note: "Explore anime culture, vintage electronics, arcades, and maid cafés.", cost: "Variable" },
          { time: "20:00", name: "Yakitori under the Yurakucho Tracks", type: "Food", duration: "1.5 hrs", note: "Atmospheric standing bars with skewered chicken and cold Sapporo beer.", cost: "$25/person" }
        ]
      },
      {
        day: 3,
        label: "Tsukiji & Teamlab",
        activities: [
          { time: "07:00", name: "Tsukiji Outer Market", type: "Food", duration: "2 hrs", note: "Fresh sushi breakfast — the best in the world. Try tamagoyaki and uni.", cost: "$30/person" },
          { time: "10:00", name: "teamLab Planets", type: "Adventure", duration: "2.5 hrs", note: "Immersive digital art universe. Book months ahead as this sells out fast.", cost: "$32/person" },
          { time: "14:00", name: "Odaiba Seaside Park", type: "Relaxation", duration: "2 hrs", note: "Stroll along the artificial island with views of Rainbow Bridge.", cost: "Free" },
          { time: "18:30", name: "Dinner Cruise on Tokyo Bay", type: "Food", duration: "2 hrs", note: "Sunset cruise with buffet dinner. Stunning nighttime views of the skyline.", cost: "$65/person" }
        ]
      },
      {
        day: 4,
        label: "Harajuku & Omotesando",
        activities: [
          { time: "10:00", name: "Meiji Jingu Shrine", type: "Culture", duration: "1.5 hrs", note: "Peaceful forest walk in the heart of the city. Arrive early for tranquility.", cost: "Free" },
          { time: "12:00", name: "Harajuku Takeshita Street", type: "Adventure", duration: "1.5 hrs", note: "Wild fashion, crepes, and Tokyo youth culture at its most expressive.", cost: "Variable" },
          { time: "14:00", name: "Omotesando Hills", type: "Culture", duration: "2 hrs", note: "Luxury shopping and stunning architecture by Tadao Ando.", cost: "Free" },
          { time: "17:00", name: "Yoyogi Park Picnic", type: "Relaxation", duration: "2 hrs", note: "Pack snacks, relax under cherry trees, watch street performers.", cost: "$10 snacks" },
          { time: "20:00", name: "Dinner at Gonpachi Nishi-Azabu", type: "Food", duration: "2 hrs", note: "The restaurant that inspired Kill Bill's fight scene. Incredible atmosphere.", cost: "$40/person" }
        ]
      },
      {
        day: 5,
        label: "Day Trip to Nikko",
        activities: [
          { time: "07:30", name: "Depart Shinjuku → Nikko", type: "Travel", duration: "2 hrs", note: "Take the JR Nikko Line. Comfortable trains with scenic countryside views.", cost: "$30 RT/person" },
          { time: "10:00", name: "Tosho-gu Shrine Complex", type: "Culture", duration: "3 hrs", note: "Ornate UNESCO World Heritage shrine. Find the famous three wise monkeys carving.", cost: "$13/person" },
          { time: "13:30", name: "Lunch at Kanaya Hotel", type: "Food", duration: "1.5 hrs", note: "Historic hotel dating to 1873. Their nikko yuba tofu dishes are exceptional.", cost: "$35/person" },
          { time: "16:00", name: "Kegon Falls", type: "Adventure", duration: "1 hr", note: "One of Japan's most spectacular waterfalls. Elevator descends 100m to viewing deck.", cost: "$6/person" }
        ]
      },
      {
        day: 6,
        label: "Shinjuku & Nightlife",
        activities: [
          { time: "11:00", name: "Tokyo Metropolitan Government Building", type: "Landmark", duration: "1 hr", note: "Free observation deck with 360° city views. Better than Sky Tree for the budget traveler.", cost: "Free" },
          { time: "13:00", name: "Shinjuku Gyoen Garden", type: "Relaxation", duration: "2 hrs", note: "Beautiful formal garden — French, English, and Japanese sections. Perfect for unwinding.", cost: "$3/person" },
          { time: "16:00", name: "Golden Gai Bar Hopping", type: "Nightlife", duration: "4 hrs", note: "Six alleyways with 200+ tiny bars. Each holds 5-8 people — intimate, local, unforgettable.", cost: "$15-40/person" },
          { time: "21:00", name: "Late Night Ramen at Fuunji", type: "Food", duration: "45 min", note: "Best tsukemen (dipping ramen) in Tokyo. Worth the late-night queue.", cost: "$12/person" }
        ]
      },
      {
        day: 7,
        label: "Departure Day",
        activities: [
          { time: "09:00", name: "Morning Walk — Imperial Palace East Gardens", type: "Relaxation", duration: "1.5 hrs", note: "Peaceful moat walk. The gardens are only open certain hours.", cost: "Free" },
          { time: "11:00", name: "Last Souvenirs — Tokyo Station", type: "Culture", duration: "2 hrs", note: "Basement food hall has incredible ekiben (train bento) and wagashi sweets.", cost: "Variable" },
          { time: "14:00", name: "Transfer to Narita Airport", type: "Travel", duration: "1.5 hrs", note: "Take the Narita Express from Tokyo Station. Very reliable.", cost: "$28/person" }
        ]
      }
    ]
  }
};

const RECOMMENDATIONS = {
  default: [
    { emoji: "🏔️", name: "Mt. Fuji Day Trip", rating: "4.9★", duration: "Full day", category: "Adventure" },
    { emoji: "🎭", name: "Kabuki Theater Show", rating: "4.7★", duration: "2-3 hrs", category: "Culture" },
    { emoji: "♨️", name: "Oedo Onsen Monogatari", rating: "4.6★", duration: "3 hrs", category: "Relaxation" },
    { emoji: "🍣", name: "Sushi Making Class", rating: "4.8★", duration: "2 hrs", category: "Food" },
    { emoji: "🎮", name: "Super Nintendo World", rating: "4.9★", duration: "Half day", category: "Adventure" },
    { emoji: "🌸", name: "Shinjuku Gyoen Night Viewing", rating: "4.5★", duration: "2 hrs", category: "Relaxation" },
  ]
};
