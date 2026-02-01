// Simple test to verify backend connection
const API_BASE_URL = 'http://localhost:9000/api';

async function testConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test basic API endpoint
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (response.ok) {
      console.log('✅ Backend connection successful!');
      console.log('Status:', response.status);
      
      const data = await response.json();
      console.log('Sample data received:', data.length ? `${data.length} products` : 'No products');
    } else {
      console.log('❌ Backend connection failed');
      console.log('Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('Make sure your backend is running on port 9000');
  }
}

testConnection();