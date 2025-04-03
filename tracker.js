// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAt0VhC7KVJ69LkK6xRtyxlXeS6AKXwBsk",
    authDomain: "protectpath-fb9d1.firebaseapp.com",
    databaseURL: "https://protectpath-fb9d1-default-rtdb.firebaseio.com",
    projectId: "protectpath-fb9d1",
    storageBucket: "protectpath-fb9d1.firebasestorage.app",
    messagingSenderId: "233985863378",
    appId: "1:233985863378:web:1cd31dc2ccb207c1cb870b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

let watchID = null;
let phoneNumber = "7603992827"; // Change this to the receiver's WhatsApp number
let trackingUrl = "";
let journeyStarted = false;

// Start tracking the journey
function startJourney() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(updateLocation, showError, { enableHighAccuracy: true });
        journeyStarted = true;
        alert("🚀 Journey Started! Live tracking enabled.");
    } else {
        alert("❌ Geolocation is not supported by this browser.");
    }
}

// Update location in Firebase & UI
function updateLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    trackingUrl = `https://www.google.com/maps?q=${lat},${lon}`;

    // Update UI
    document.getElementById("trackingLink").innerHTML = 
        `🔗 <a href="${trackingUrl}" target="_blank">Live Tracking Link</a>`;

    // Store latest location in Firebase
    db.ref("location").set({ latitude: lat, longitude: lon });

    // Save to localStorage
    localStorage.setItem("latestLocation", trackingUrl);
}

// Send WhatsApp Message with Live Location
function sendWhatsApp() {
    if (!journeyStarted) {
        alert("⚠ Please start the journey first!");
        return;
    }

    if (!trackingUrl) {
        alert("⚠ No location available yet! Try again in a moment.");
        return;
    }

    let message = encodeURIComponent(`🔔 ProtectPath Live Tracking\n🚶‍♂ Live Location:\n📍 ${trackingUrl}`);
    let whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp with the pre-filled message
    window.open(whatsappUrl, "_blank");
}

// Stop tracking the journey
function endJourney() {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        journeyStarted = false;
        alert("🛑 Journey Ended! Tracking stopped.");

        // Disable link
        document.getElementById("trackingLink").innerHTML = "🔗 Tracking disabled!";
    } else {
        alert("No active tracking session.");
    }
}

// Handle location errors
function showError(error) {
    alert("Error getting location: " + error.message);
}

// Load saved location on page refresh
window.onload = function() {
    let savedLocation = localStorage.getItem("latestLocation");
    if (savedLocation) {
        document.getElementById("trackingLink").innerHTML = 
            `🔗 <a href="${savedLocation}" target="_blank">Live Tracking Link</a>`;
    }
};
