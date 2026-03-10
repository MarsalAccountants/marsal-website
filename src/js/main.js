// ===============================
// Marsal Global JavaScript
// ===============================

// Run only in the browser
document.addEventListener("DOMContentLoaded", () => {

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Global utility function
  window.marsal = {
    log: (msg) => console.log(`[Marsal] ${msg}`)
  };

  marsal.log("Global JS loaded");
});
