document.addEventListener("DOMContentLoaded", () => {
  const contentSections = document.querySelectorAll(".content-section");
  const navLinks = document.querySelectorAll(".nav-link");

  // Function to switch sections
  const showSection = (sectionId) => {
    contentSections.forEach((section) => {
      section.style.display = section.id === sectionId ? "block" : "none";
    });
  };

  // Event listeners for navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((nav) => nav.classList.remove("active"));
      link.classList.add("active");
      showSection(link.dataset.section + "-section");
    });
  });

  // Default: show dashboard section
  showSection("dashboard-section");
});





