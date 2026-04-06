import { FaSearch, FaShoppingBag, FaUser, FaHeart, FaBlog, FaClipboardList, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CartDrawer from "../ui/cartsPopup";
import { useState, useEffect } from "react";
import LoginModal from "../ui/login";
import RegisterModal from "../ui/register";
import PageLoader from "../ui/PageLoader";
import UserAvatar from "../ui/UserAvatar";
import { useTranslation } from "react-i18next";

export default function SecondNavBar() {
  const { t } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem("user"); }
    }
    const handleUserUpdate = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser && updatedUser !== "undefined") {
        try { setUser(JSON.parse(updatedUser)); } catch {}
      }
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem("user"); }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/Shop?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="bg-blue-600 py-2 sm:py-4">
      <ul className="max-w-7xl mx-auto px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 mt-4 sm:mt-10">
        {/* LOGO */}
        <li className="text-white text-xl sm:text-2xl font-bold tracking-wide order-1">
          B-DIFFERENT
        </li>

        {/* SEARCH BAR */}
        <li className="flex-1 w-full sm:max-w-xl order-3 sm:order-2">
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 sm:px-5 py-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("blog.search")}
              className="flex-1 outline-none text-xs sm:text-sm text-gray-700"
            />
            <button type="submit" className="ml-1">
              <FaSearch className="text-gray-500 text-xs sm:text-sm cursor-pointer hover:text-blue-600 transition-colors" />
            </button>
          </form>
        </li>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 sm:gap-6 order-2 sm:order-3">
          <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
            <Link to="/" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
              <FaHome className="text-lg sm:text-sm" />
              <span className="hidden sm:inline">{t("nav.home")}</span>
            </Link>
          </li>
          <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
            <Link to="/shop" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
              <FaSearch className="text-lg sm:text-sm" />
              <span className="hidden sm:inline">{t("nav.shop")}</span>
            </Link>
          </li>
          <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
            <Link to="/blogs" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
              <FaBlog className="text-lg sm:text-sm" />
              <span className="hidden sm:inline">{t("nav.blogs")}</span>
            </Link>
          </li>
          <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
            <Link to="/Favourites" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
              <FaHeart className="text-lg sm:text-sm" />
              <span className="hidden sm:inline">{t("nav.favs")}</span>
            </Link>
          </li>
          <li onClick={() => setIsCartOpen(true)} className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors cursor-pointer list-none">
            <div className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
              <FaShoppingBag className="text-lg sm:text-sm" />
              <span className="hidden sm:inline">{t("nav.carts")}</span>
            </div>
          </li>
          {user && (
            <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
              <Link to="/orders" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
                <FaClipboardList className="text-lg sm:text-sm" />
                <span className="hidden sm:inline">{t("nav.orders")}</span>
              </Link>
            </li>
          )}
          {user && (user.role === "vendor" || user.UserType === "vendor") && (
            <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
              <Link to="/vendor/dashboard" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
                <span className="hidden sm:inline">{t("nav.dashboard")}</span>
              </Link>
            </li>
          )}
          {user && (user.role === "admin" || user.UserType === "admin") && (
            <li className="p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
              <Link to="/admin/dashboard" className="flex items-center gap-1 text-white text-xs sm:text-sm font-medium hover:opacity-80">
                <span className="hidden sm:inline">{t("nav.admin")}</span>
              </Link>
            </li>
          )}
          <li className="relative text-white text-xs sm:text-sm font-medium cursor-pointer p-2 sm:p-1 rounded-lg sm:rounded-none hover:bg-blue-700 sm:hover:bg-transparent transition-colors list-none">
            {user ? (
              <div onClick={() => { setLoading(true); setTimeout(() => { navigate("/profile"); setLoading(false); }, 500); }} className="flex items-center gap-2 hover:opacity-80">
                <UserAvatar user={user} size="md" showUsername={true} />
              </div>
            ) : (
              <div onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2 hover:opacity-80">
                <FaUser className="text-lg sm:text-sm" />
                <span className="hidden sm:inline">{t("nav.signIn")}</span>
              </div>
            )}
          </li>
        </div>
      </ul>
      {loading && <PageLoader />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </nav>
  );
}
