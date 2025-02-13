// Configuration Object
const CONFIG = {
  API_BASE_URL: "https://your-heroku-backend.herokuapp.com",
  MAP: {
    defaultCenter: { lat: 22.5726, lng: 88.3639 },
    defaultZoom: 12,
    updateInterval: 5000,
    markerIcon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  },
  SELECTORS: {
    spinner: "#spinner",
    navbar: ".navbar",
    backToTop: ".back-to-top",
    portfolio: {
      container: ".portfolio-container",
      filters: "#portfolio-flters li"
    }
  }
};

// Module Pattern Implementation
const App = (() => {
  // Private Variables
  let mapInstance = null;
  let mapMarker = null;
  const blogPosts = [];
  const comments = [];

  // Private Methods
  const _sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const _handleApiError = (error) => {
    console.error("API Error:", error);
    _showNotification("An error occurred. Please try again.", "error");
  };

  const _showNotification = (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Public Methods
  return {
    initialize() {
      // Initialization sequence
      this.initSpinner();
      this.initAnimations();
      this.initEventListeners();
      this.initCarousels();
      this.initIsotope();
    },

    initSpinner() {
      setTimeout(() => {
        const spinner = document.querySelector(CONFIG.SELECTORS.spinner);
        if (spinner) spinner.classList.remove("show");
      }, 100);
    },

    initAnimations() {
      new WOW().init();
    },

    initEventListeners() {
      // Window Scroll Events
      window.addEventListener("scroll", () => {
        // Sticky Navbar
        const navbar = document.querySelector(CONFIG.SELECTORS.navbar);
        navbar?.classList.toggle("sticky-top shadow-sm", window.scrollY > 45);

        // Back to Top Button
        const backToTop = document.querySelector(CONFIG.SELECTORS.backToTop);
        if (backToTop) {
          backToTop.style.display = window.scrollY > 100 ? "block" : "none";
        }
      });

      // Back to Top Click
      document.querySelector(CONFIG.SELECTORS.backToTop)?.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    },

    initCarousels() {
      // Testimonials Carousel
      $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        dots: false,
        loop: true,
        center: true,
        responsive: {
          0: { items: 1 },
          576: { items: 1 },
          768: { items: 2 },
          992: { items: 3 }
        }
      });
    },

    initIsotope() {
      // Portfolio Isotope
      const portfolioIsotope = new Isotope(CONFIG.SELECTORS.portfolio.container, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows"
      });

      document.querySelectorAll(CONFIG.SELECTORS.portfolio.filters).forEach(item => {
        item.addEventListener("click", () => {
          document.querySelector(`${CONFIG.SELECTORS.portfolio.filters}.active`)
            ?.classList.remove("active");
          item.classList.add("active");
          portfolioIsotope.arrange({ filter: item.dataset.filter });
        });
      });
    },

    // Blog System
    async loadBlogPosts() {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/posts`);
        if (!response.ok) throw new Error("Failed to load posts");
        const posts = await response.json();
        blogPosts.length = 0;
        blogPosts.push(...posts);
        this.renderBlogPosts();
      } catch (error) {
        _handleApiError(error);
      }
    },

    renderBlogPosts() {
      const container = document.querySelector(".blog-list");
      if (!container) return;

      container.innerHTML = blogPosts.map(post => `
        <article class="blog-post">
          <h2>${_sanitizeInput(post.title)}</h2>
          <p class="meta">By ${_sanitizeInput(post.author)} | ${_sanitizeInput(post.date)}</p>
          <p class="category">Categories: ${post.categories.map(c => `
            <a href="#">${_sanitizeInput(c)}</a>
          `).join(", ")}</p>
          <p>${_sanitizeInput(post.content)}</p>
          <button class="read-more" data-id="${post.id}">Read More</button>
        </article>
      `).join("");
    },

    // Comment System
    addComment(text) {
      const sanitizedText = _sanitizeInput(text.trim());
      if (!sanitizedText) return;

      comments.push(sanitizedText);
      this.renderComments();
    },

    renderComments() {
      const container = document.getElementById("comments-list");
      if (container) {
        container.innerHTML = comments
          .map(comment => `<p>${comment}</p>`)
          .join("");
      }
    },

    // OTP System
    async handleOTPRequest(email) {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/generate-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        document.getElementById("otp-form").classList.add("hidden");
        document.getElementById("verify-form").classList.remove("hidden");
        _showNotification("OTP sent to your email!", "success");
      } catch (error) {
        _handleApiError(error);
      }
    },

    async verifyOTP(email, otp) {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp })
        });

        const messageElement = document.getElementById("otp-message");
        if (!response.ok) {
          const error = await response.text();
          messageElement.textContent = error;
          messageElement.style.color = "red";
          throw new Error(error);
        }

        messageElement.textContent = "OTP verified successfully!";
        messageElement.style.color = "green";
        _showNotification("OTP verification successful!", "success");
      } catch (error) {
        _handleApiError(error);
      }
    },

    // Map System
    initializeMap() {
      if (!document.getElementById("map")) return;

      mapInstance = new google.maps.Map(document.getElementById("map"), {
        center: CONFIG.MAP.defaultCenter,
        zoom: CONFIG.MAP.defaultZoom
      });

      mapMarker = new google.maps.Marker({
        map: mapInstance,
        position: CONFIG.MAP.defaultCenter,
        title: "Bus Location",
        icon: CONFIG.MAP.markerIcon
      });

      this.startLocationUpdates();
    },

    async updateLocation() {
      try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/get-location/bus-id`);
        if (!response.ok) throw new Error("Location update failed");

        const location = await response.json();
        mapMarker.setPosition(location);
        mapInstance.panTo(location);
      } catch (error) {
        _handleApiError(error);
      }
    },

    startLocationUpdates() {
      setInterval(() => this.updateLocation(), CONFIG.MAP.updateInterval);
    }
  };
})();

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  App.initialize();

  // Blog System
  App.loadBlogPosts();

  // Comment System
  document.getElementById("comment-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    App.addComment(input.value);
    input.value = "";
  });

  // OTP System
  document.getElementById("otp-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    App.handleOTPRequest(email);
  });

  document.getElementById("verify-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;
    App.verifyOTP(email, otp);
  });

  // Initialize Map
  if (typeof google !== "undefined") {
    App.initializeMap();
  }
});