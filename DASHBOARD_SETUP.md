# E-commerce Dashboard Setup

## Backend Setup (E-commerce-Api)

1. Navigate to the backend directory:
   ```bash
   cd "c:\Users\HP\Documents\tresor documents\coding\E-commerce-Api"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:9000`

## Frontend Setup (full-Ecommerce)

1. Navigate to the frontend directory:
   ```bash
   cd "c:\Users\HP\Documents\tresor documents\coding\full-Ecommerce"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Admin Dashboard Access

To access the admin dashboard:

1. Make sure both backend and frontend are running
2. Navigate to the frontend URL
3. Login with admin credentials
4. The dashboard will be available at `/admin/dashboard`

## API Endpoints Connected

The following admin endpoints are now connected:

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/orders` - Order management
- `GET /api/admin/products/top` - Top products
- `GET /api/admin/customers` - Customer management
- `GET /api/admin/campaigns` - Campaign management
- `POST /api/admin/campaigns` - Create new campaign

## Features Working

✅ Dashboard statistics (revenue, orders, customers, products)
✅ Real-time data from backend
✅ Order management with real order data
✅ Customer management
✅ Product management
✅ Campaign management
✅ Analytics and reporting
✅ Admin authentication and authorization

## Testing Connection

Run the test script to verify backend connection:
```bash
node test-connection.js
```

## Environment Variables

Make sure your `.env` file in the frontend has:
```
VITE_API_URL=http://localhost:9000/api
VITE_TIMEOUT=10000
```

## Notes

- The backend uses MongoDB for data storage
- Admin routes require authentication (Bearer token)
- All dashboard components now fetch real data from the backend
- Error handling is implemented for failed API calls