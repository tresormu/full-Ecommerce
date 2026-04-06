import { FaBlog, FaPhone, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FirstNavBar() {
  const { t } = useTranslation();

  return (
    <nav className="bg-blue-600 text-white text-xs px-2 sm:px-4 lg:px-6 py-1.5 flex items-center justify-between">
      {/* Left spacer to keep welcome centered */}
      <div className="hidden sm:block w-32" />

      {/* Center - Welcome Message */}
      <h3 className="font-medium tracking-wide text-center flex-1 text-xs sm:text-sm">
        {t('home.welcome')}
      </h3>

      {/* Right - Links */}
      <ul className="flex gap-2 lg:gap-4 items-center">
        <li className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-gray-200">
          <FaBlog className="text-[10px]" />
          <Link to="/BLogs">{t('nav.blog')}</Link>
        </li>
        <li className="hidden sm:flex items-center gap-1 cursor-pointer hover:text-gray-200">
          <FaBook className="text-[10px]" />
          <Link to="/FAQ">{t('nav.faq')}</Link>
        </li>
        <li className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
          <FaPhone className="text-[10px]" />
          <Link to="/ContactUs">{t('nav.contact')}</Link>
        </li>
      </ul>
    </nav>
  );
}
