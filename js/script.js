// OTP Verification
document.getElementById("otp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  const response = await fetch("https://your-heroku-backend.herokuapp.com/api/generate-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    document.getElementById("otp-form").style.display = "none";
    document.getElementById("verify-form").style.display = "block";
    alert("OTP sent to your email!");
  } else {
    alert("Failed to send OTP. Please try again.");
  }
});

document.getElementById("verify-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  const response = await fetch("https://your-heroku-backend.herokuapp.com/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const message = document.getElementById("otp-message");
  if (response.ok) {
    message.textContent = "OTP verified successfully!";
    message.style.color = "green";
  } else {
    message.textContent = "Invalid OTP.";
    message.style.color = "red";
  }
});

// Google Maps Live Location
function initializeMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.5726, lng: 88.3639 }, // Default location (Kolkata)
    zoom: 12,
  });

  setInterval(async () => {
    const response = await fetch("https://your-heroku-backend.herokuapp.com/api/get-location/bus-id");
    const location = await response.json();

    new google.maps.Marker({
      position: location,
      map,
    });
  }, 5000);
}

window.onload = initializeMap;
