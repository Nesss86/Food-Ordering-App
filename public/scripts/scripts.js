$(document).ready(() => {
  const sections = $(".content-section");
  const navLinks = $(".nav-link");

  // Navigation Logic
  navLinks.click(function (e) {
    e.preventDefault();
    const target = $(this).data("section");
    sections.hide();
    $(`#${target}`).show();
    navLinks.removeClass("active");
    $(this).addClass("active");
  });

  // Fetch and populate orders
  function fetchOrders() {
    $.get("/api/orders", (orders) => {
      const container = $("#orders-container");
      container.empty();
      orders.forEach((order) => {
        const orderHTML = `
          <div class="order">
            <p>Order #${order.id}: ${order.items}</p>
            <p>Time to Completion: ${order.time_to_completion} mins</p>
            <button class="approve" data-id="${order.id}">Approve</button>
            <button class="reject" data-id="${order.id}">Reject</button>
          </div>`;
        container.append(orderHTML);
      });
    });
  }

  // Approve/Reject actions
  $("#orders-container").on("click", "button", function () {
    const orderId = $(this).data("id");
    const action = $(this).hasClass("approve") ? "approved" : "rejected";
    const timeToCompletion = action === "approved" ? "10 mins" : "N/A";

    $("#order-status-table tbody").append(`
      <tr>
        <td>${orderId}</td>
        <td>${action}</td>
        <td>${timeToCompletion}</td>
      </tr>
    `);
  });

  // Fetch and populate inventory
  function fetchInventory() {
    $.get("/api/inventory", (inventory) => {
      const tableBody = $("#inventory-table");
      tableBody.empty();
      inventory.forEach((item) => {
        const row = `<tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.status}</td>
        </tr>`;
        tableBody.append(row);
      });
    });
  }

  // Fetch and populate order history
  function fetchOrderHistory() {
    $.get("/api/orders/history", (orders) => {
      const tableBody = $("#history-table");
      tableBody.empty();
      orders.forEach((order) => {
        const row = `<tr>
          <td>${order.id}</td>
          <td>${order.customer}</td>
          <td>${order.items}</td>
          <td>${order.date}</td>
        </tr>`;
        tableBody.append(row);
      });
    });
  }

  // Search functionality for order history
  $("#search-orders").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    $("#history-table tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      $(this).toggle(rowText.includes(searchTerm));
    });
  });

  // Initial load
  fetchOrders();
  fetchInventory();
  fetchOrderHistory();
});



