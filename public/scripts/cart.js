let cart = [];

// Function to add items to cart
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  updateCartView();
}

// Update cart view dynamically
function updateCartView() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalContainer = document.getElementById('cart-total');

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItemsContainer.innerHTML += `
      <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
    `;
  });

  cartTotalContainer.innerText = total.toFixed(2);
}

// Function to submit order
async function submitOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to submit an order.');
    return;
  }

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Prepare the order object
  const order = {
    time_placed: new Date().toISOString(), // Current timestamp
    time_ready: null, // Placeholder for now, backend can set this if needed
    order_status: 'pending', // Default status
    total_price: totalPrice,
    items: cart.map(item => ({
      food_id: item.id, // Assuming each item in the cart has a unique ID
      quantity: item.quantity
    }))
  };

  try {
    const response = await fetch('/customer_orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    
    console.log('Response status:', response.status); // Log status code
    const responseBody = await response.json();
    console.log('Response body:', responseBody); // Log response body
    
    if (!response.ok) {
      alert(`Error submitting order: ${responseBody.error || 'Unknown error'}`);
      return;
    }
    
    alert('Order submitted successfully!');

    // Clear the cart
    cart = [];
    updateCartView();
  } catch (err) {
    console.error('Error submitting order:', err);
    alert('Failed to submit the order. Please try again.');
  }
}
