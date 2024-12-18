$(document).ready(() => {
  // Fetch and Display Pending Orders
  const loadOrders = () => {
    $.get('/api/orders', (data) => {
      const ordersContainer = $('#orders-container');
      ordersContainer.empty();
      const pendingOrders = data.orders; // Pending orders

      pendingOrders.forEach(order => {
        // Convert ISO string to a readable date and time
        const dateTime = new Date(order.time_placed).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });

        // Create HTML for the order
        const orderHtml = `
          <form class="order-form" method="post" action="/admin_orders/${order.order_id}">
            <input type="hidden" name="_method" value="PATCH">
            <input type="hidden" name="status" value="">
            <div class="order" data-id="${order.order_id}">
              <p><strong>Customer:</strong> ${order.customername}</p>
              <p><strong>Items:</strong> ${order.items}</p>
              <p><strong>Time Placed:</strong> ${dateTime}</p>
              <label for="readyAt-${order.order_id}"><strong>Time for order to get ready (in minutes):</strong></label>
              <textarea id="readyAt-${order.order_id}" class="form-control" name="ready_at" rows="1" placeholder="Enter time"></textarea><br><br>
              <button type="button" class="approve-btn btn btn-success">Approve</button>
              <button type="button" class="reject-btn btn btn-danger">Reject</button>
            </div>
          </form>
        `;
        ordersContainer.append(orderHtml);
      });
    });
  };

  // Update Order Status Table
  const updateOrderStatusTable = (orderId, status, customer, items, timeToComplete = '15 mins') => {
    const tableBody = $('#order-status-table tbody');
    const rowHtml = `
      <tr>
        <td>${orderId}</td>
        <td>${customer}</td>
        <td>${items}</td>
        <td>${status}</td>
        <td>${timeToComplete}</td>
      </tr>
    `;
    tableBody.append(rowHtml);
  };

// Handle Approve/Reject Buttons
$('#orders-container').on('click', '.approve-btn, .reject-btn', function () {
  const form = $(this).closest('form');
  const status = $(this).hasClass('approve-btn') ? 'approved' : 'rejected';
  form.find('input[name="status"]').val(status); // Set the status in the hidden input
  form.submit(); // Submit the form
  $.ajax({
    url: `/api/orders/${orderId}`,
    method: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify({ status, ready_at: readyAt }),
    success: () => {
      updateOrderStatusTable(orderId, status, customer, items, readyAt ? `${readyAt} mins` : 'N/A');
      parent.remove(); // Remove the order from "Manage Orders"
    },
    error: (err) => {
      console.error(`Failed to update order ${orderId}:`, err.responseJSON?.error || err);
      alert(`Failed to update order ${orderId}. Please try again.`);
    }
  });
});


  // Inventory Section
  const loadInventory = () => {
    $.get('/api/inventory', (data) => {
      const inventoryTable = $('#inventory-table');
      inventoryTable.empty();
      data.forEach(item => {
        const rowHtml = `
          <tr>
            <td>${item.name}</td>
            <td>${item.total_quantity}</td>
            <td>${item.total_quantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
          </tr>
        `;
        inventoryTable.append(rowHtml);
      });
    });
  };

  // Order History Section
  const loadOrderHistory = (search = '') => {
    $.get(`/api/orders/history?search=${search}`, (data) => {
      const historyTable = $('#history-table');
      historyTable.empty();

      data.history.forEach(order => {
        const rowHtml = `
          <tr>
            <td>${order.order_id}</td>
            <td>${order.customername}</td>
            <td>${order.foodname}</td>
            <td>${order.quantity}</td>
            <td>${order.time_placed}</td>
          </tr>
        `;
        historyTable.append(rowHtml);
      });
    });
  };

  // Search functionality for Order History
  $('#history-search').on('input', function () {
    const searchQuery = $(this).val();
    loadOrderHistory(searchQuery);
  });

  // Navigation Between Sections
  $('.nav-link').on('click', function (e) {
    e.preventDefault();
    const sectionId = $(this).data('section');
    $('.content-section').hide();
    $(`#${sectionId}`).show();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    // Reload relevant data
    if (sectionId === 'orders-section') loadOrders();
    if (sectionId === 'inventory-section') loadInventory();
    if (sectionId === 'history-section') loadOrderHistory();
  });

  // Initial Load
  loadOrders(); // Load Manage Orders on page load
});










