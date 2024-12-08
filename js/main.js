(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        dots: false,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

const blogPosts = [
  {
    title: "My First Blog Post",
    author: "Author Name",
    date: "October 28, 2024",
    categories: ["Category1", "Category2"],
    content: "This is the content of my first blog post..."
  },
  {
    title: "Another Blog Post",
    author: "Author Name",
    date: "October 27, 2024",
    categories: ["Category1", "Category3"],
    content: "This is some more content for a second post..."
  }
];
function loadBlogPosts() {
  const blogContainer = document.querySelector('.blog-list'); // Your existing blog list container
  blogContainer.innerHTML = ''; // Clear existing content

  blogPosts.forEach(post => {
    const postElement = document.createElement('article');
    postElement.className = 'blog-post';

    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p class="meta">By ${post.author} | ${post.date}</p>
      <p class="category">Categories: ${post.categories.join(', ')}</p>
      <p>${post.content}</p>
      <a href="#" class="read-more" onclick="loadFullPost('${post.title}')">Read More</a>
    `;

    blogContainer.appendChild(postElement);
  });
}

function loadFullPost(title) {
  const post = blogPosts.find(post => post.title === title);
  if (post) {
    document.querySelector('.blog-title').textContent = post.title;
    document.querySelector('.blog-meta .author').textContent = post.author;
    document.querySelector('.blog-meta .date').textContent = post.date;
    document.querySelector('.blog-category').innerHTML = `Categories: ${post.categories.map(cat => `<a href="#">${cat}</a>`).join(', ')}`;
    document.querySelector('.blog-content').textContent = post.content;
  }
}

document.addEventListener('DOMContentLoaded', loadBlogPosts);
const comments = [];

function addComment() {
  const commentInput = document.getElementById('comment-input');
  const commentText = commentInput.value.trim();
  if (commentText) {
    comments.push(commentText);
    commentInput.value = '';
    displayComments();
  }
}

function displayComments() {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = comments.map(comment => `<p>${comment}</p>`).join('');
}
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










