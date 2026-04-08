import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./shared/components/layouts/cartcontext";
import { WishlistProvider } from "./shared/components/layouts/wishlistcontext";
import { useEffect, useState, lazy, Suspense } from "react";
import AdminAuthGuard from "./components/AdminAuthGuard";
import AppInstallPrompt from "./components/AppInstallPrompt";

// Lazy Load Pages for Mobile-First Performance
const Home = lazy(() => import("./shared/components/pages/Home"));
const Blogs = lazy(() => import("./shared/components/pages/blogs"));
const Carts = lazy(() => import("./shared/components/pages/cartsDiv"));
const Elements = lazy(() => import("./shared/components/pages/elements"));
const ContactUs = lazy(() => import("./shared/components/pages/contactUs"));
const FAQ = lazy(() => import("./shared/components/pages/F&Q"));
const Favourites = lazy(() => import("./shared/components/pages/favourites"));
const Shop = lazy(() => import("./shared/components/pages/shop"));
const ProductPage = lazy(() => import("./shared/components/pages/prodWeb"));
const CategoriesWeb = lazy(() => import("./shared/components/pages/categoryWeb"));
const Checkout = lazy(() => import("./shared/components/layouts/checkout"));
const Profile = lazy(() => import("./shared/components/pages/Profile"));
const ModernDashboard = lazy(() => import("./pages/ModernDashboard"));
const Orders = lazy(() => import("./pages/OrdersNew"));
const Products = lazy(() => import("./pages/Products"));
const Customers = lazy(() => import("./pages/Customers"));
const Campaign = lazy(() => import("./pages/Campaign"));
const AddCampaign = lazy(() => import("./pages/AddCampaign"));
const Analytics = lazy(() => import("./pages/Analytics"));
const UserOrders = lazy(() => import("./shared/components/pages/UserOrders"));
const PaymentResult = lazy(() => import("./shared/components/pages/PaymentResult"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));

function RouteLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200); // Reduced delay for faster perception
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-blue-600 font-bold tracking-widest uppercase animate-pulse">B-different</p>
    </div>
  );
}

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

function AppRoutes() {
  return (
    <>
      <AppInstallPrompt />
      <RouteLoader />
      <Routes>
        <Route path="/" element={<PageSuspense><Home /></PageSuspense>} />
        <Route path="/blogs" element={<PageSuspense><Blogs /></PageSuspense>} />
        <Route path="/product/:id" element={<PageSuspense><ProductPage /></PageSuspense>} />
        <Route path="/Carts" element={<PageSuspense><Carts /></PageSuspense>} />
        <Route path="/Elements" element={<PageSuspense><Elements /></PageSuspense>} />
        <Route path="/category/:name" element={<PageSuspense><CategoriesWeb /></PageSuspense>} />
        <Route path="/ContactUs" element={<PageSuspense><ContactUs /></PageSuspense>} />
        <Route path="/FAQ" element={<PageSuspense><FAQ /></PageSuspense>} />
        <Route path="/Favourites" element={<PageSuspense><Favourites /></PageSuspense>} />
        <Route path="/Shop" element={<PageSuspense><Shop /></PageSuspense>} />
        <Route path="/profile" element={<PageSuspense><Profile /></PageSuspense>} />
        <Route path="/orders" element={<PageSuspense><UserOrders /></PageSuspense>} />
        <Route path="/checkout" element={<PageSuspense><Checkout /></PageSuspense>} />
        <Route path="/payment-result" element={<PageSuspense><PaymentResult /></PageSuspense>} />
        <Route path="/vendor/dashboard" element={<PageSuspense><VendorDashboard /></PageSuspense>} />
        <Route path="/admin/dashboard" element={<AdminAuthGuard><PageSuspense><ModernDashboard /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/orders" element={<AdminAuthGuard><PageSuspense><Orders /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/products" element={<AdminAuthGuard><PageSuspense><Products /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/customers" element={<AdminAuthGuard><PageSuspense><Customers /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/campaign" element={<AdminAuthGuard><PageSuspense><Campaign /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/campaign/add" element={<AdminAuthGuard><PageSuspense><AddCampaign /></PageSuspense></AdminAuthGuard>} />
        <Route path="/admin/analytics" element={<AdminAuthGuard><PageSuspense><Analytics /></PageSuspense></AdminAuthGuard>} />
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
