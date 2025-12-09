# ProtectPath
# Empower
ProtectPath – Real-Time Journey Safety Tracker

ProtectPath is a real-time location tracking system built using Firebase Realtime Database.
It allows a user to share their live journey link (viewer page) that updates automatically without refreshing, while the tracker page continuously pushes the user’s location to Firebase.

This system is designed for personal safety, emergency tracking, and secure journey monitoring.

🚀 Features

Live Location Tracking powered by Firebase

Two-page System:

tracker.html → Sends real-time GPS updates

viewer.html → Shows live movement on map

Start/End Journey Controls

WhatsApp Link Sharing (visible only after Start Journey)

Auto-updating map without refresh

Journey deactivation after End Journey

📁 Project Structure
ProtectPath/
│
├── tracker.html      # Sends location to Firebase
├── viewer.html       # Displays live location updates
├── README.md         # Project documentation
└── assets/           # (Optional) CSS/JS files

🔧 Technologies Used

HTML, CSS, JavaScript

Firebase Realtime Database

Google Maps JavaScript API

WhatsApp Deep Link API

Geolocation API

⚙️ How It Works
1️⃣ tracker.html

Requests GPS permission

Sends live coordinates (lat, lng, timestamp) to Firebase

Starts tracking only when Start Journey is clicked

Shows Send WhatsApp Link button after journey starts

Stops sending updates when End Journey is clicked

2️⃣ viewer.html

Listens to the same Firebase node in real-time

Automatically updates the marker position

No page refresh required

Works only while active = true in Firebase

🗂️ Firebase Database Structure
{
  "journey": {
    "active": true,
    "lat": 11.3410,
    "lng": 77.7172,
    "timestamp": 1712492139
  }
}

▶️ How to Run
1. Clone the Repository
git clone https://github.com/your-username/ProtectPath.git

2. Add your Firebase config

Inside both tracker.html and viewer.html, update:

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

3. Open tracker

Open tracker.html on your mobile

Click Start Journey

4. Share Live Link

WhatsApp button appears

Send the viewer link to contacts

5. Open viewer

Open viewer.html → See live moving marker

📌 Future Improvements

Multi-user tracking

Journey history storage

Data encryption

SOS audio/video upload

Mobile app (Flutter / React Native)
![image alt]()

ProtectPath/
│
├── tracker.html          # Sends live GPS updates to Firebase
├── viewer.html           # Displays real-time moving marker from Firebase
├── README.md             # Complete project documentation
│
└── assets/               # (Optional) Extra resources
    ├── logo.png          # Project logo
    └── screenshots/      # Images for README
        ├── tracker_start.png
        ├── tracker_active.png
        ├── viewer_live.png
        └── firebase_data.png



