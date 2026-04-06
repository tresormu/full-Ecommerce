import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./shared/components/layouts/cartcontext";
import { WishlistProvider } from "./shared/components/layouts/wishlistcontext";
import { useEffect, useState } from "react";
import Home from "./shared/components/pages/Home";
import Blogs from "./shared/components/pages/blogs";
import Carts from "./shared/components/pages/cartsDiv";
import Elements from "./shared/components/pages/elements";
import ContactUs from "./shared/components/pages/contactUs";
import FAQ from "./shared/components/pages/F&Q";
import Favourites from "./shared/components/pages/favourites";
import Shop from "./shared/components/pages/shop";
import ProductPage from "./shared/components/pages/prodWeb";
import CategoriesWeb from "./shared/components/pages/categoryWeb";
import Checkout from "./shared/components/layouts/checkout";
import Profile from "./shared/components/pages/Profile";
import ModernDashboard from "./pages/ModernDashboard";
import Orders from "./pages/OrdersNew";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Campaign from "./pages/Campaign";
import AddCampaign from "./pages/AddCampaign";
import Analytics from "./pages/Analytics";
import UserOrders from "./shared/components/pages/UserOrders";
import PaymentResult from "./shared/components/pages/PaymentResult";
import AdminAuthGuard from "./components/AdminAuthGuard";
import VendorDashboard from "./pages/VendorDashboard";

function RouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium tracking-wide">Loading...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <RouteLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/Carts" element={<Carts />} />
        <Route path="/Elements" element={<Elements />} />
        <Route path="/category/:name" element={<CategoriesWeb />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/Favourites" element={<Favourites />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminAuthGuard><ModernDashboard /></AdminAuthGuard>} />
        <Route path="/admin/orders" element={<AdminAuthGuard><Orders /></AdminAuthGuard>} />
        <Route path="/admin/products" element={<AdminAuthGuard><Products /></AdminAuthGuard>} />
        <Route path="/admin/customers" element={<AdminAuthGuard><Customers /></AdminAuthGuard>} />
        <Route path="/admin/campaign" element={<AdminAuthGuard><Campaign /></AdminAuthGuard>} />
        <Route path="/admin/campaign/add" element={<AdminAuthGuard><AddCampaign /></AdminAuthGuard>} />
        <Route path="/admin/analytics" element={<AdminAuthGuard><Analytics /></AdminAuthGuard>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
