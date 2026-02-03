const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'https://e-commerce-api-2bvq.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const adminAPI = {
  // Admin Authentication
  adminLogin: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    
    const data = await response.json();
    console.log('Login response:', data); // Debug log
    
    // Check if user is admin - try both possible field names
    const userRole = data.user.role || data.user.UserType;
    if (userRole !== 'admin') {
      throw new Error(`Access denied. Admin privileges required. Current role: ${userRole}`);
    }
    
    return data;
  },

  adminRegister: async (userData: {
    username: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, UserType: 'admin' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 409) {
        throw new Error('Email or username already exists');
      }
      throw new Error(errorData.message || 'Failed to register admin');
    }
    
    return response.json();
  },
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Analytics
  getAnalytics: async (range = '7d') => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics?range=${range}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getTopProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products/top`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch top products');
    return response.json();
  },

  // Customers
  getCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },

  // Campaigns
  getCampaigns: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  },

  addCampaign: async (campaignData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaignData),
    });
    if (!response.ok) throw new Error('Failed to add campaign');
    return response.json();
  },

  // Update product stock
  updateProductStock: async (productId: string, newStock: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stock: newStock }),
    });
    if (!response.ok) throw new Error('Failed to update stock');
    return response.json();
  },

  // Reduce stock for multiple products (for order processing)
  reduceProductStock: async (items: Array<{ productId: string, quantity: number }>) => {
    const response = await fetch(`${API_BASE_URL}/products/reduce-stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error('Failed to reduce stock');
    return response.json();
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    const response = await fetch(`${API_BASE_URL}/products/low-stock?threshold=${threshold}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch low stock products');
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch products by category');
    return response.json();
  },
  // Process order with stock deduction
  processOrder: async (orderData: { 
    items: Array<{ productId: string, quantity: number, name?: string, price?: number }>,
    customerInfo?: any,
    total?: number 
  }) => {
    const response = await fetch(`${API_BASE_URL}/orders/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to process order');
    return response.json();
  },

  // Add sample products (for initial setup)
  addSampleProducts: async (products: any[]) => {
    const response = await fetch(`${API_BASE_URL}/products/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ products }),
    });
    if (!response.ok) throw new Error('Failed to add sample products');
    return response.json();
  },
};