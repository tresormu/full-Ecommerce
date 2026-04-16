const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://tresore-commerce.andasy.dev/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const vendorAPI = {
  // Get vendor dashboard stats
  getVendorStats: async () => {
    const response = await fetch(`${API_BASE_URL}/vendor/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch vendor stats');
    return response.json();
  },

  // Get vendor products
  getVendorProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/vendor/products`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch vendor products');
    return response.json();
  },

  // Add new product
  addProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/vendor/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to add product');
    return response.json();
  },

  // Update product
  updateProduct: async (productId: string, productData: any) => {
    const response = await fetch(`${API_BASE_URL}/vendor/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Save payment credentials (stored locally)
  savePaymentCredentials: (data: { momoNumber: string; momoName: string; bankAccount: string; bankName: string }) => {
    localStorage.setItem('vendorPayment', JSON.stringify(data));
  },

  // Get payment credentials
  getPaymentCredentials: () => {
    const stored = localStorage.getItem('vendorPayment');
    return stored ? JSON.parse(stored) : null;
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/vendor/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },
};