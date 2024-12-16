document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("orders");

  // Function to fetch and render orders
  const fetchOrders = () => {
    fetch('/api/orders')
      .then((response) => response.json())
      .then((data) => {
        // Clear the orders container before rendering
        ordersContainer.innerHTML = "";

        // Populate the orders
        data.orders.forEach((order) => {
          const orderElement = document.createElement("div");
          orderElement.classList.add("order");

          orderElement.innerHTML = `
            <p>Order #${order.id}: ${order.customerName} - ${order.foodName} (x${order.quantity})</p>
            <button class="approve" data-id="${order.id}">Approve</button>
            <button class="reject" data-id="${order.id}">Reject</button>
          `;

          ordersContainer.appendChild(orderElement);
        });
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  };

  // Function to update order status
  const updateOrderStatus = (orderId, status) => {
    fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (response.ok) {
          // Refetch the orders after status update
          fetchOrders();
        } else {
          console.error(`Failed to update order ${orderId} to ${status}`);
        }
      })
      .catch((err) => console.error(`Error updating order ${orderId}:`, err));
  };

  // Event listener for approve/reject buttons
  ordersContainer.addEventListener("click", (event) => {
    const order = event.target.closest(".order");

    if (event.target.classList.contains("approve")) {
      const orderId = event.target.dataset.id;

      // Update the backend and visually change the UI
      updateOrderStatus(orderId, "approved");
      order.innerHTML = `<p style="color: green;">Order Approved</p>`;
    } else if (event.target.classList.contains("reject")) {
      const orderId = event.target.dataset.id;

      // Update the backend and visually change the UI
      updateOrderStatus(orderId, "rejected");
      order.innerHTML = `<p style="color: red;">Order Rejected</p>`;
    }
  });

  // Initial fetch of orders when page loads
  fetchOrders();
});

