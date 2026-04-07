import { FaSearch, FaShoppingBag, FaUser, FaHeart, FaBlog, FaClipboardList, FaHome, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CartDrawer from "../ui/cartsPopup";
import { useState, useEffect } from "react";
import LoginModal from "../ui/login";
import RegisterModal from "../ui/register";
import PageLoader from "../ui/PageLoader";
import UserAvatar from "../ui/UserAvatar";
import { useTranslation } from "react-i18next";
import SearchBar from "../ui/SearchBar";

export default function SecondNavBar() {
  const { t } = useTranslation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <>
      <nav className="bg-blue-600 py-2 sm:py-4">
        {/* Main bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-3 sm:gap-6 mt-2 sm:mt-6">
          {/* LOGO */}
          <span className="text-white text-xl sm:text-2xl font-bold tracking-wide shrink-0">
            B-DIFFERENT
          </span>

          {/* SEARCH BAR — hidden on xs, visible sm+ */}
          <SearchBar
            placeholder={t("blog.search")}
            className="hidden sm:block flex-1 max-w-xl"
          />

          {/* RIGHT — desktop links + always-visible icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Desktop-only links */}
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/" className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80">
                <FaHome /><span>{t("nav.home")}</span>
              </Link>
              <Link to="/Shop" className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80">
                <FaSearch /><span>{t("nav.shop")}</span>
              </Link>
              <Link to="/blogs" className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80">
                <FaBlog /><span>{t("nav.blogs")}</span>
              </Link>
              <Link to="/Favourites" className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80">
                <FaHeart /><span>{t("nav.favs")}</span>
              </Link>
              {user && (
                <Link to="/orders" className="flex items-center gap-1 text-white text-sm font-medium hover:opacity-80">
                  <FaClipboardList /><span>{t("nav.orders")}</span>
                </Link>
              )}
              {user && (user.role === "vendor" || user.UserType === "vendor") && (
                <Link to="/vendor/dashboard" className="text-white text-sm font-medium hover:opacity-80">{t("nav.dashboard")}</Link>
              )}
              {user && (user.role === "admin" || user.UserType === "admin") && (
                <Link to="/admin/dashboard" className="text-white text-sm font-medium hover:opacity-80">{t("nav.admin")}</Link>
              )}
            </div>

            {/* Always-visible: cart + user */}
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors">
              <FaShoppingBag className="text-lg" />
            </button>
            <div
              onClick={() => user
                ? (setLoading(true), setTimeout(() => { navigate("/profile"); setLoading(false); }, 500))
                : setIsLoginOpen(true)
              }
              className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              {user ? <UserAvatar user={user} size="sm" showUsername={false} /> : <FaUser className="text-lg" />}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <SearchBar
          placeholder={t("blog.search")}
          className="sm:hidden mx-3 mt-2"
        />

        {/* Mobile slide-down menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-blue-700 mt-2 px-4 py-3 flex flex-col gap-1">
            {[
              { to: "/", icon: <FaHome />, label: t("nav.home") },
              { to: "/Shop", icon: <FaSearch />, label: t("nav.shop") },
              { to: "/blogs", icon: <FaBlog />, label: t("nav.blogs") },
              { to: "/Favourites", icon: <FaHeart />, label: t("nav.favs") },
              ...(user ? [{ to: "/orders", icon: <FaClipboardList />, label: t("nav.orders") }] : []),
              ...(user && (user.role === "vendor" || user.UserType === "vendor")
                ? [{ to: "/vendor/dashboard", icon: <FaHome />, label: t("nav.dashboard") }] : []),
              ...(user && (user.role === "admin" || user.UserType === "admin")
                ? [{ to: "/admin/dashboard", icon: <FaHome />, label: t("nav.admin") }] : []),
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-white text-sm font-medium py-2.5 px-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        )}

        {loading && <PageLoader />}
      </nav>

      {/* Rendered outside <nav> to avoid stacking context clipping */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </>
  );
}
