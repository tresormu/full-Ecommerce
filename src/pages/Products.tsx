import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { adminAPI } from "../shared/services/adminAPI";
import { CatgoriesArr } from "../shared/store/Categories";
import { sampleProducts } from "../shared/store/sampleProducts";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://tresore-commerce.andasy.dev/api';

interface Product {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  category?: string;
  price?: number;
  stock?: number;
  status?: string;
  createdAt?: string;
  __v?: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSampleDataModal, setShowSampleDataModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '100',
    description: '',
    images: [] as File[]
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = newProduct.images;
    const totalImages = currentImages.length + files.length;
    
    if (totalImages > 4) {
      alert('Maximum 4 images allowed');
      return;
    }
    
    setNewProduct({...newProduct, images: [...currentImages, ...files]});
  };

  const removeImage = (index: number) => {
    const updatedImages = newProduct.images.filter((_, i) => i !== index);
    setNewProduct({...newProduct, images: updatedImages});
  };

  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      await adminAPI.addSampleProducts(sampleProducts);
      setShowSampleDataModal(false);
      alert('Sample products added successfully!');
      // Refresh products list
      const data = await adminAPI.getProducts();
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      }
      setProducts(productsArray);
    } catch (error) {
      console.error('Error adding sample data:', error);
      alert('Failed to add sample data. Please ensure your backend is running and the endpoint is implemented.');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await adminAPI.updateProductStock(productId, newStock);
      // Refresh products list
      const data = await adminAPI.getProducts();
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      }
      setProducts(productsArray);
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      formData.append('description', newProduct.description);
      
      newProduct.images.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      if (response.ok) {
        const result = await response.json();
        console.log('Add product response:', result);
        setShowAddModal(false);
        setNewProduct({ name: '', category: '', price: '', stock: '100', description: '', images: [] });
        alert('Product added successfully!');
        // Refresh products list
        const data = await adminAPI.getProducts();
        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          productsArray = data.data;
        }
        setProducts(productsArray);
      } else {
        const errorText = await response.text();
        console.error('Failed to add product:', errorText);
        alert(`Failed to add product: ${response.status} - ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Fetch products
        const productsData = await adminAPI.getProducts();
        console.log('API Response:', productsData);
        
        // Handle different response structures
        let productsArray = [];
        if (Array.isArray(productsData)) {
          productsArray = productsData;
        } else if (productsData.products && Array.isArray(productsData.products)) {
          productsArray = productsData.products;
        } else if (productsData.data && Array.isArray(productsData.data)) {
          productsArray = productsData.data;
        }
        
        console.log('Products Array:', productsArray);
        setProducts(productsArray);
        
        // Fetch categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || categoriesData || []);
        } else {
          // Fallback to static categories if API fails
          setCategories(CatgoriesArr);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        // Use static categories as fallback
        setCategories(CatgoriesArr);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:ml-56">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-2 sm:p-4 lg:p-6 lg:ml-56">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Products Management</h2>
              <p className="text-gray-600 mt-1 text-sm">Manage your product inventory</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowSampleDataModal(true)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Add Sample Data
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
            <p className="text-sm mt-2">Make sure your backend is running on port 9000 and try adding sample data first.</p>
          </div>
        )}

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover mr-2 sm:mr-3"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{product.name || 'N/A'}</div>
                            {product.description && (
                              <div className="text-xs text-gray-500 truncate max-w-xs hidden sm:block">{product.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {typeof product.category === 'object' ? 
                            ((product.category as any)?.name || 'N/A') : 
                            (product.category ? String(product.category).charAt(0).toUpperCase() + String(product.category).slice(1) : 'N/A')
                          }
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">${product.price || 0}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 mr-1 sm:mr-2">{product.stock || 100}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            (product.stock || 100) > 50 ? 'bg-green-400' : 
                            (product.stock || 100) > 10 ? 'bg-yellow-400' : 
                            'bg-red-400'
                          }`}></div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (product.stock || 100) > 50 ? 'bg-green-100 text-green-800' : 
                          (product.stock || 100) > 10 ? 'bg-yellow-100 text-yellow-800' : 
                          (product.stock || 100) > 0 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(product.stock || 100) > 50 ? 'In Stock' :
                           (product.stock || 100) > 10 ? 'Low Stock' : 
                           (product.stock || 100) > 0 ? 'Very Low Stock' : 
                           'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleStockUpdate(product._id, (product.stock || 0) + 10)}
                            className="text-green-600 hover:text-green-900 text-xs px-1 sm:px-2 py-1 border border-green-300 rounded hover:bg-green-50 transition-colors"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleStockUpdate(product._id, Math.max(0, (product.stock || 0) - 10))}
                            className="text-red-600 hover:text-red-900 text-xs px-1 sm:px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                            title="Remove 10 units"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleStockUpdate(product._id, 100)}
                            className="text-blue-600 hover:text-blue-900 text-xs px-1 sm:px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors hidden sm:inline-block"
                            title="Reset to 100"
                          >
                            Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 sm:px-6 py-8 sm:py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-base sm:text-lg font-medium mb-2">No products found</div>
                        <div className="text-sm mb-4">Get started by adding some sample products to your inventory</div>
                        <button 
                          onClick={() => setShowSampleDataModal(true)}
                          className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Sample Products
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Sample Data Confirmation Modal */}
      {showSampleDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Sample Products</h3>
            <p className="text-gray-600 mb-6">
              This will add {sampleProducts.length} sample products to your inventory. Each product will have:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• Stock: 100 units each</li>
              <li>• Real categories: {CatgoriesArr.map(cat => cat.name).join(', ')}</li>
              <li>• Proper product details and images</li>
            </ul>
            <div className="flex gap-2">
              <button
                onClick={handleAddSampleData}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Sample Data'}
              </button>
              <button
                onClick={() => setShowSampleDataModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[95vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 sm:p-3 border rounded-lg text-sm"
                  required
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 sm:p-3 border rounded-lg text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id || category.name} value={category._id || category.name}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full p-2 sm:p-3 border rounded-lg text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock (default: 100)"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full p-2 sm:p-3 border rounded-lg text-sm"
                  min="0"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-2 sm:p-3 border rounded-lg h-16 sm:h-20 text-sm resize-none"
                />
                
                {/* Image Upload */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Images (Max 4)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border rounded-lg text-xs sm:text-sm"
                    disabled={newProduct.images.length >= 4}
                  />
                  
                  {/* Image Preview */}
                  {newProduct.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {newProduct.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-12 sm:h-16 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 sm:py-3 rounded-lg hover:bg-purple-700 text-xs sm:text-sm font-medium"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-400 text-xs sm:text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}