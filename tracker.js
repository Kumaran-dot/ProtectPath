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
let phoneNumber = "7603992827";

// 🟢 Start Live Tracking
function startJourney() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(updateLocation, showError, { enableHighAccuracy: true });
        journeyStarted = true;
        alert("🚀 Journey Started! Live tracking enabled.");
    } else {
        alert("❌ Geolocation is not supported by this browser.");
    }
}

// 🔄 Update Firebase With Latest Location
function updateLocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let now = new Date();
    let formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";

    let trackingUrl = `https://www.google.com/maps?q=${lat},${lon}`;

    document.getElementById("trackingLink").innerHTML = 
        `🔗 <a href="${trackingUrl}" target="_blank">Live Tracking Link</a>`;

    // ✅ Update Firebase with real-time listener
    db.ref("location").set({ 
        latitude: lat, 
        longitude: lon, 
        timestamp: formattedTimestamp
    })
    .then(() => console.log("🔥 Location updated:", formattedTimestamp))
    .catch((error) => console.error("❌ Firebase update failed:", error));
}

// 🚀 Real-time Listener for Location Updates
db.ref("location").on("value", (snapshot) => {
    let data = snapshot.val();
    if (data) {
        let liveTrackingUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
        document.getElementById("trackingLink").innerHTML = 
            `🔗 <a href="${liveTrackingUrl}" target="_blank">Live Tracking Link</a>`;
    }
});

// 📩 Send WhatsApp Message with Latest Location
function sendWhatsApp() {
    if (!journeyStarted) {
        alert("⚠ Please start the journey first!");
        return;
    }

    db.ref("location").once("value", (snapshot) => {
        let data = snapshot.val();
        if (data && data.latitude && data.longitude) {
            let liveTrackingUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
            let message = encodeURIComponent(`🔔 ProtectPath Live Tracking\n🚶‍♂ Live Location:\n📍 ${liveTrackingUrl}\n🕒 ${data.timestamp}`);
            let whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

            window.open(whatsappUrl, "_blank");
        } else {
            alert("⚠ Location data not available! Try again.");
        }
    });
}

// 🛑 Stop Tracking & Disable Link
function endJourney() {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        journeyStarted = false;
        alert("🛑 Journey Ended! Tracking stopped.");
        document.getElementById("trackingLink").innerHTML = "🔗 Tracking disabled!";
    } else {
        alert("No active tracking session.");
    }
}

// ⚠ Handle Geolocation Errors
function showError(error) {
    alert("Error getting location: " + error.message);
}
