$(document).ready(() => {
  // Navigation between sections
  const navigateToSection = (sectionId) => {
    $(".content-section").hide();
    $(`#${sectionId}`).show();
    $(".nav-link").removeClass("active");
    $(`.nav-link[data-section="${sectionId}"]`).addClass("active");
  };

  $(".nav-link").on("click", function (e) {
    e.preventDefault();
    const sectionId = $(this).data("section");
    navigateToSection(sectionId);
  });

  // Manage Orders Functionality
  $("#orders-container").on("click", ".approve-btn", function () {
    const parent = $(this).closest(".order");
    const customer = parent.find("p strong:contains('Customer:')").parent().text();
    const items = parent.find("p strong:contains('Items:')").parent().text();
    const time = parent.find("p strong:contains('Time to Complete:')").parent().text();

    $("#order-status-table tbody").append(`
      <tr>
        <td>${customer} - ${items}</td>
        <td>Approved</td>
        <td>${time}</td>
      </tr>
    `);
    parent.remove();
    navigateToSection("orders-section");
  });

  $("#orders-container").on("click", ".reject-btn", function () {
    const parent = $(this).closest(".order");
    const customer = parent.find("p strong:contains('Customer:')").parent().text();
    const items = parent.find("p strong:contains('Items:')").parent().text();

    $("#order-status-table tbody").append(`
      <tr>
        <td>${customer} - ${items}</td>
        <td>Rejected</td>
        <td>N/A</td>
      </tr>
    `);
    parent.remove();
    navigateToSection("orders-section");
  });

  // Initialize default section
  navigateToSection("orders-section");
});










