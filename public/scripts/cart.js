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
function submitOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to submit an order.');
    return;
  }

  let orderSummary = 'Order Submitted!\n\nYour Items:\n';
  cart.forEach(item => {
    orderSummary += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  orderSummary += `\nTotal: $${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;
  alert(orderSummary);

  console.log('Order:', cart);
  cart = []; // Clear the cart
  updateCartView();
}
