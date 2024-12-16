const getOrders = () => {
  return db.query(`
    SELECT orders.id, customers.name AS customerName, food_items.name AS foodName, order_items.quantity
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
    JOIN order_items ON orders.id = order_items.order_id
    JOIN food_items ON order_items.food_id = food_items.id
    WHERE orders.order_status = 'pending'
    ORDER BY orders.id;
  `).then(res => res.rows);
};

const updateOrderStatus = (orderId, status) => {
  return db.query(`
    UPDATE orders
    SET order_status = $2
    WHERE id = $1;
  `, [orderId, status]);
};

