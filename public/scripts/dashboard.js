$(document).ready(() => {
  // Fetch and Display Only 5 Orders
  const loadOrders = () => {
    $.get('/api/orders', (data) => {
      const ordersContainer = $('#orders-container');
      ordersContainer.empty();
      const limitedOrders = data.orders.slice(0, 5); // Limit to 5 orders
      limitedOrders.forEach(order => {
        const orderHtml = `
          <div class="order" data-id="${order.id}">
            <p><strong>Customer:</strong> ${order.customername}</p>
            <p><strong>Items:</strong> ${order.foodname}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Time to Complete:</strong> 15 mins</p>
            <button class="approve-btn">Approve</button>
            <button class="reject-btn">Reject</button>
          </div>
        `;
        ordersContainer.append(orderHtml);
      });
    });
  };

  // Update Order Status Table
  const updateOrderStatus = (orderId, status, customer, items) => {
    const rowHtml = `
      <tr>
        <td>${orderId}</td>
        <td>${customer}</td>
        <td>${items}</td>
        <td>${status}</td>
      </tr>
    `;
    $('#order-status-table tbody').append(rowHtml);
  };

  // Approve/Reject Orders
  $('#orders-container').on('click', '.approve-btn, .reject-btn', function () {
    const parent = $(this).closest('.order');
    const orderId = parent.data('id');
    const customer = parent.find('p').eq(0).text().replace('Customer: ', '');
    const items = parent.find('p').eq(1).text().replace('Items: ', '');
    const status = $(this).hasClass('approve-btn') ? 'Approved' : 'Rejected';

    $.ajax({
      url: `/api/orders/${orderId}`,
      method: 'PATCH',
      data: { status },
      success: () => {
        updateOrderStatus(orderId, status, customer, items);
        parent.remove(); // Remove order from Manage Orders
      },
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
  loadOrders();
});










