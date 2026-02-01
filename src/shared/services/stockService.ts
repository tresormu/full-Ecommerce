import { adminAPI } from './adminAPI';

export const stockService = {
  // Reduce stock when order is placed
  reduceStock: async (items: Array<{ productId: string, quantity: number }>) => {
    try {
      // Use the new bulk stock reduction endpoint
      await adminAPI.reduceProductStock(items);
      return { success: true };
    } catch (error) {
      console.error('Error reducing stock:', error);
      throw error;
    }
  },

  // Check if products have enough stock
  checkStock: async (items: Array<{ productId: string, quantity: number }>) => {
    try {
      const products = await adminAPI.getProducts();
      const productArray = Array.isArray(products) ? products : products.products || products.data || [];
      
      for (const item of items) {
        const product = productArray.find((p: any) => p._id === item.productId);
        if (!product || product.stock < item.quantity) {
          return { 
            success: false, 
            message: `Insufficient stock for ${product?.name || 'product'}. Available: ${product?.stock || 0}, Requested: ${item.quantity}` 
          };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error checking stock:', error);
      throw error;
    }
  },

  // Process order with automatic stock deduction
  processOrderWithStockDeduction: async (orderData: {
    items: Array<{ productId: string, quantity: number, name?: string, price?: number }>,
    customerInfo?: any,
    total?: number
  }) => {
    try {
      // First check if we have enough stock
      const stockCheck = await stockService.checkStock(orderData.items);
      if (!stockCheck.success) {
        throw new Error(stockCheck.message);
      }

      // Process the order (this will also reduce stock on the backend)
      const orderResult = await adminAPI.processOrder(orderData);
      
      return { success: true, order: orderResult };
    } catch (error) {
      console.error('Error processing order with stock deduction:', error);
      throw error;
    }
  }
};