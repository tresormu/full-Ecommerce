import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ThirdNavBar() {
  const { t } = useTranslation();
  return (
    <nav className="bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center h-12 sm:h-14 lg:hidden">
          <button className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800">
            {t('nav.menu')}
            <FaBars className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-8 h-14 text-sm font-semibold text-gray-800">
          <li className="flex items-center gap-2 px-4 h-full cursor-pointer hover:bg-gray-50">
            {t('nav.shopByDept')}
            <FaBars className="text-sm" />
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors">
            <Link to="/">{t('nav.home')}</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors">
            <Link to="/Shop">{t('nav.shop')}</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors">{t('nav.pages')}</li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors">
            <Link to="/Blogs">{t('nav.blogs')}</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600 transition-colors">
            <Link to="/Elements">{t('nav.elements')}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
