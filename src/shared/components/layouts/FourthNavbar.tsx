import {
  FaCartShopping,
  FaHeart,
  FaUser,
  FaMagnifyingGlass,
} from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CartDrawer from "../ui/cartsPopup";
import LoginModal from "../ui/login";
import PageLoader from "../ui/PageLoader";
import UserAvatar from "../ui/UserAvatar";

export default function StickyNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ SHOW navbar when scrolling DOWN
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Never show on home page
      if (location.pathname === "/") {
        setShow(false);
        return;
      }

      // Show after scrolling down 100px
      setShow(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // ✅ Load user
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("userUpdated", loadUser);
    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const handleProfileClick = () => {
    if (user) {
      setLoading(true);
      setTimeout(() => {
        navigate("/profile");
        setLoading(false);
      }, 500);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-blue-500 shadow-lg z-[50] transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center p-2 sm:p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-base sm:text-xl font-bold text-white"
        >
          B-DIFFERENT
        </Link>

        {/* Center */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-1 text-white">
            <FaHome />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </Link>

          <div className="flex items-center bg-white/20 rounded-full px-2 sm:px-3 py-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchTerm.trim()) navigate(`/Shop?q=${encodeURIComponent(searchTerm.trim())}`); }}
              placeholder="Search..."
              className="bg-transparent text-white placeholder-white/70 outline-none text-xs sm:text-sm w-20 sm:w-32"
            />
            <button onClick={() => { if (searchTerm.trim()) navigate(`/Shop?q=${encodeURIComponent(searchTerm.trim())}`); }}>
              <FaMagnifyingGlass className="ml-1 text-white cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <ul className="flex gap-2 sm:gap-4 text-white text-xs sm:text-sm">
          <li
            onClick={handleProfileClick}
            className="flex items-center gap-1 cursor-pointer"
          >
            {user ? (
              <UserAvatar user={user} size="sm" showUsername />
            ) : (
              <>
                <FaUser />
                <span className="hidden sm:inline">{t('nav.signIn')}</span>
              </>
            )}
          </li>

          <li className="flex items-center gap-1 cursor-pointer">
            <FaHeart />
            <Link to="/Favourites" className="hidden sm:inline">
              {t('nav.favs')}
            </Link>
          </li>

          <li
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <FaCartShopping />
            <span className="hidden sm:inline">{t('nav.carts')}</span>
          </li>
        </ul>
      </div>

      {loading && <PageLoader />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}
