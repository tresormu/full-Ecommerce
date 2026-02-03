// Simple test to check if API is accessible
import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    const response = await axios.get('http://localhost:9000/api/auth', {
      timeout: 5000
    });
    console.log('✅ API is accessible');
    console.log('Response status:', response.status);
  } catch (error) {
    console.log('❌ API connection failed');
    if (error.code === 'ECONNREFUSED') {
      console.log('Backend server is not running on port 9000');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('Request timed out - server might be slow');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAPI();