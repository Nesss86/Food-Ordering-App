document.addEventListener("DOMContentLoaded", () => {
  // Get all navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  // Get all content sections
  const contentSections = document.querySelectorAll(".content-section");

  // Add event listener to each navigation link
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      // Remove 'active' class from all navigation links
      navLinks.forEach(link => link.classList.remove("active"));

      // Add 'active' class to the clicked link
      link.classList.add("active");

      // Get the section to display based on data-section attribute
      const sectionId = `${link.dataset.section}-section`;

      // Hide all sections, then show the target section
      contentSections.forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
      });
    });
  });

  // Default: Show the dashboard section on page load
  document.getElementById("dashboard-section").style.display = "block";
});


