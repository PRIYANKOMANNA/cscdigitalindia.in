// Initialize WOW.js for animations
new WOW().init();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // OTP Form Handling
  dom.otpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleOTP.generate(dom.emailInput.value);
  });

  dom.verifyForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleOTP.verify(dom.emailInput.value, dom.otpInput.value);
  });

  // Text Generation
  document.getElementById('generateBtn')?.addEventListener('click', handleTextGeneration.generate);

  // Initialize Lightbox
  [].slice.call(document.querySelectorAll('[data-lightbox]')).forEach(el => {
    new Lightbox(el);
  });

  // Initialize Owl Carousel
  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  });
});

// Google Maps Initialization
if (typeof google !== 'undefined') {
  liveLocation.initialize();
}

// Back to Top Button
document.querySelector('.back-to-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});