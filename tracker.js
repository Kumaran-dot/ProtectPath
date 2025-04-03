// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAt0VhC7KVJ69LkK6xRtyxlXeS6AKXwBsk",
    authDomain: "protectpath-fb9d1.firebaseapp.com",
    databaseURL: "https://protectpath-fb9d1-default-rtdb.firebaseio.com",
    projectId: "protectpath-fb9d1",
    storageBucket: "protectpath-fb9d1.firebasestorage.app",
    messagingSenderId: "233985863378",
    appId: "1:233985863378:web:1cd31dc2ccb207c1cb870b"
};
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

let watchID = null;
let journeyStarted = false;
let phoneNumber = "917603992827";  // WhatsApp number with country code ✅

// Function to get current timestamp in UTC format (YYYY-MM-DD HH:MM:SS UTC)
function getTimestamp() {
    return new Date().toISOString().replace("T", " ").split(".")[0] + " UTC";
}

// Start live tracking (updates every 10 seconds)
function startJourney() {
    if (navigator.geolocation) {
        journeyStarted = true;
        alert("🚀 Journey Started! Live tracking enabled.");
        updateLocation(); // Get initial location immediately

        // ✅ Force update every 10 seconds
        watchID = setInterval(updateLocation, 10000);
    } else {
        alert("❌ Geolocation is not supported by this browser.");
    }
}

// Update location in Firebase every 10 seconds
function updateLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let trackingUrl = `https://www.google.com/maps?q=${lat},${lon}`;

        // ✅ Update Firebase with new coordinates and timestamp
        db.ref("location").set({
            latitude: lat,
            longitude: lon,
            timestamp: getTimestamp()
        }).then(() => {
            console.log("🔥 Location updated in Firebase:", trackingUrl);
        }).catch(error => console.error("❌ Firebase update failed:", error));
    }, showError, { enableHighAccuracy: true });
}

// Automatically listen for updates and refresh the tracking link
function listenForLocationUpdates() {
    db.ref("location").on("value", snapshot => {
        let data = snapshot.val();
        if (data && data.latitude && data.longitude) {
            let updatedTrackingUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
            document.getElementById("trackingLink").innerHTML = 
                `🔗 <a href="${updatedTrackingUrl}" target="_blank">Live Tracking Link</a>`;

            // ✅ Save to localStorage for persistence
            localStorage.setItem("latestLocation", updatedTrackingUrl);
            console.log("📡 Updated tracking link:", updatedTrackingUrl);
        }
    });
}

// Send WhatsApp message with latest tracking link
function sendWhatsApp() {
    if (!journeyStarted) {
        alert("⚠ Please start the journey first!");
        return;
    }

    db.ref("location").once("value", snapshot => {
        let data = snapshot.val();
        if (data && data.latitude && data.longitude) {
            let liveTrackingUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
            let message = encodeURIComponent(`🔔 ProtectPath Live Tracking\n🚶‍♂ Live Location:\n📍 ${liveTrackingUrl}\n🕒 ${data.timestamp}`);
            let whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

            console.log("✅ WhatsApp URL:", whatsappUrl);  // Debugging step
            window.open(whatsappUrl, "_blank");  // Open WhatsApp with the latest location
        } else {
            alert("⚠ Location data not available! Try again in a moment.");
        }
    });
}

// Stop live tracking & disable link
function endJourney() {
    if (watchID !== null) {
        clearInterval(watchID); // ✅ Stop the 10-second interval updates
        watchID = null;
        journeyStarted = false;
        alert("🛑 Journey Ended! Tracking stopped.");

        // Disable tracking link
        document.getElementById("trackingLink").innerHTML = "🔗 Tracking disabled!";
    } else {
        alert("No active tracking session.");
    }
}

// Handle geolocation errors
function showError(error) {
    alert("Error getting location: " + error.message);
}

// Load last location on page refresh
window.onload = function() {
    listenForLocationUpdates();  // ✅ Start listening for Firebase updates
    let savedLocation = localStorage.getItem("latestLocation");
    if (savedLocation) {
        document.getElementById("trackingLink").innerHTML = 
            `🔗 <a href="${savedLocation}" target="_blank">Live Tracking Link</a>`;
    }
};
