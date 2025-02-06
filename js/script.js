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

  const marker = new google.maps.Marker({
    map,
    position: { lat: 22.5726, lng: 88.3639 },
    title: "Bus Location",
  });

  // Update location every 5 seconds
  setInterval(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/get-location/bus-id`);
      if (response.ok) {
        const location = await response.json();
        marker.setPosition(location);
        map.setCenter(location);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }, 5000);
}

window.onload = initializeMap;


document.getElementById("otp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      document.getElementById("otp-form").style.display = "none";
      document.getElementById("verify-form").style.display = "block";
      alert("OTP sent to your email!");
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send OTP. Please check your network or server.");
  }
});

document.getElementById("verify-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const message = document.getElementById("otp-message");
    if (response.ok) {
      message.textContent = "OTP verified successfully!";
      message.style.color = "green";
    } else {
      const error = await response.text();
      message.textContent = `Error: ${error}`;
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to verify OTP. Please check your network or server.");
  }
});




async function generateText() {
  const prompt = document.getElementById('prompt').value;

  if (!prompt) {
    document.getElementById('generatedText').innerText = "Please enter a prompt.";
    return;
  }

  try {
    const response = await fetch("https://your-backend-api-url/generate", {  // Replace with your API URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt })
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('generatedText').innerText = data.response;
    } else {
      document.getElementById('generatedText').innerText = "Error generating text.";
    }
  } catch (error) {
    document.getElementById('generatedText').innerText = "Network error.";
  }
}






