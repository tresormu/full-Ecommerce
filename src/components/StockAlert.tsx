import { useState, useEffect } from 'react';
import { adminAPI } from '../shared/services/adminAPI';

interface LowStockProduct {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default function StockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const data = await adminAPI.getLowStockProducts(threshold);
        const products = Array.isArray(data) ? data : data.products || data.data || [];
        setLowStockProducts(products);
      } catch (error) {
        console.error('Error fetching low stock products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [threshold]);

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await adminAPI.updateProductStock(productId, newStock);
      // Refresh the list
      const data = await adminAPI.getLowStockProducts(threshold);
      const products = Array.isArray(data) ? data : data.products || data.data || [];
      setLowStockProducts(products);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
          Stock Alerts
        </h3>
        <select 
          value={threshold} 
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value={5}>Below 5</option>
          <option value={10}>Below 10</option>
          <option value={20}>Below 20</option>
          <option value={50}>Below 50</option>
        </select>
      </div>
      
      {lowStockProducts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">All products have sufficient stock!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {lowStockProducts.map((product) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                <div className="text-xs text-gray-500">
                  {product.category} • ${product.price}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-red-600">
                  {product.stock} left
                </span>
                <button
                  onClick={() => handleStockUpdate(product._id, product.stock + 50)}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                  title="Add 50 units"
                >
                  +50
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {lowStockProducts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} need{lowStockProducts.length === 1 ? 's' : ''} restocking
          </p>
        </div>
      )}
    </div>
  );
}