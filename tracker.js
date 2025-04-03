// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAt0VhC7KVJ69LkK6xRtyxlXeS6AKXwBsk",
    authDomain: "protectpath-fb9d1.firebaseapp.com",
    databaseURL: "https://protectpath-fb9d1-default-rtdb.firebaseio.com",
    projectId: "protectpath-fb9d1",
    storageBucket: "protectpath-fb9d1.appspot.com",
    messagingSenderId: "233985863378",
    appId: "1:233985863378:web:1cd31dc2ccb207c1cb870b"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

let watchID = null;
let journeyStarted = false;

// Start journey tracking
function startJourney() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(updateLocation, showError, { enableHighAccuracy: true });
        journeyStarted = true;
        alert("🚀 Journey Started! Live tracking enabled.");
    } else {
        alert("❌ Geolocation is not supported by this browser.");
    }
}

// Update location in Firebase
function updateLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let timestamp = new Date().getTime(); // Forces Firebase update

    let trackingUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    
    document.getElementById("trackingLink").innerHTML = 
        `🔗 <a href="${trackingUrl}" target="_blank">Live Tracking Link</a>`;

    // ✅ Update Firebase with timestamp
    db.ref("location").set({ latitude: lat, longitude: lon, timestamp: timestamp })
    .then(() => console.log("🔥 Location updated in Firebase"))
    .catch((error) => console.error("❌ Firebase update failed:", error));

    // Send WhatsApp message only once per session
    if (!sessionStorage.getItem("linkSent")) {
        sendWhatsApp(trackingUrl);
        sessionStorage.setItem("linkSent", "true");
    }
}

// Send WhatsApp message with live location
function sendWhatsApp(link) {
    if (!journeyStarted) {
        alert("⚠ Please start the journey first!");
        return;
    }

    let message = encodeURIComponent(`🔔 ProtectPath Live Tracking\n🚶‍♂ Live Location:\n📍 ${link}`);
    let whatsappUrl = `https://wa.me/7603992827?text=${message}`;

    // Open WhatsApp with the updated link
    window.open(whatsappUrl, "_blank");
}

// Stop tracking & disable link
function endJourney() {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        journeyStarted = false;
        alert("🛑 Journey Ended! Tracking stopped.");

        // Remove tracking link
        document.getElementById("trackingLink").innerHTML = "🔗 Tracking disabled!";
    } else {
        alert("No active tracking session.");
    }
    sessionStorage.removeItem("linkSent"); // Reset sending flag
}

// Handle geolocation errors
function showError(error) {
    alert("Error getting location: " + error.message);
}

// Load last location on page refresh
window.onload = function() {
    db.ref("location").once("value", (snapshot) => {
        let data = snapshot.val();
        if (data && data.latitude && data.longitude) {
            let savedLocation = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
            document.getElementById("trackingLink").innerHTML = 
                `🔗 <a href="${savedLocation}" target="_blank">Live Tracking Link</a>`;
        }
    });
};
