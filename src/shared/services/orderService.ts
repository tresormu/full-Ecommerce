const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:9000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const orderService = {
  // Create order from cart
  createOrder: async (orderData: {
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    paymentMethod: string;
  }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cartName: `${user.username}_cart`,
          items: orderData.items,
          customerInfo: orderData.customerInfo,
          totalAmount: orderData.total,
          paymentMethod: orderData.paymentMethod
        }),
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/user`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    return response.json();
  },

  // Get cart items
  getCartItems: async (cartName: string) => {
    const response = await fetch(`${API_BASE_URL}/cart/${cartName}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  // Get order by ID
  getOrderById: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Update order status (admin)
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  // Clear cart after order
  clearCart: async (cartName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cartName }),
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      return response.json();
    } catch (error) {
      console.log('Cart clear failed, but order was successful');
      return { success: true };
    }
  },
};