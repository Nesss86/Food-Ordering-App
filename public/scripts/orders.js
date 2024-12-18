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
            <button class="approve" data-id="${order.id}" data-status="approved">Approve</button>
            <button class="reject" data-id="${order.id}" data-status="rejected">Reject</button>
          `;

          ordersContainer.appendChild(orderElement);
        });
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        ordersContainer.innerHTML = "<p class='error'>Failed to load orders. Please try again later.</p>";
      });
  };

  // Function to update order status
  const updateOrderStatus = (orderId, status) => {
    return fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to update order ${orderId} to ${status}`);
        }
        return response.json();
      })
      .catch((err) => {
        console.error(`Error updating order ${orderId}:`, err);
        throw err;
      });
  };

  // Event listener for approve/reject buttons
  ordersContainer.addEventListener("click", (event) => {
    const button = event.target;
    const order = event.target.closest(".order");

    if (button.classList.contains("approve") || button.classList.contains("reject")) {
      const orderId = button.dataset.id;
      const status = button.dataset.status;

      // Disable buttons to prevent multiple clicks
      button.disabled = true;

      // Update the backend and refetch the orders
      updateOrderStatus(orderId, status)
        .then(() => fetchOrders()) // Refetch the orders to reflect changes
        .catch(() => {
          button.disabled = false; // Re-enable button on error
          alert("Failed to update order. Please try again.");
        });
    }
  });

  // Initial fetch of orders when page loads
  fetchOrders();
});


