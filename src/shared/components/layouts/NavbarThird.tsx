import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function ThirdNavBar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: t('nav.home') },
    { to: "/Shop", label: t('nav.shop') },
    { to: "/blogs", label: t('nav.blogs') },
    { to: "/Elements", label: t('nav.elements') },
  ];

  return (
    <nav className="bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Mobile toggle */}
        <div className="flex items-center justify-between h-12 sm:h-14 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-800"
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            {t('nav.menu')}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <ul className="lg:hidden flex flex-col border-t border-gray-100 pb-2">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop menu */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-8 h-14 text-sm font-semibold text-gray-800">
          <li className="flex items-center gap-2 px-4 h-full cursor-pointer hover:bg-gray-50">
            {t('nav.shopByDept')}
            <FaBars className="text-sm" />
          </li>
          {links.map(({ to, label }) => (
            <li key={to} className="cursor-pointer hover:text-blue-600 transition-colors">
              <Link to={to}>{label}</Link>
            </li>
          ))}
          <li className="cursor-pointer hover:text-blue-600 transition-colors">{t('nav.pages')}</li>
        </ul>
      </div>
    </nav>
  );
}
