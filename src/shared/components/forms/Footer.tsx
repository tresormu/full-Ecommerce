import {
  FaHome, FaPhone, FaMailBulk, FaClock,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-6 sm:pt-8 lg:pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">

        {/* Brand */}
        <div className="hidden sm:block lg:col-span-1 space-y-2 sm:space-y-3">
          <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold">B-DIFFERENT</h3>
          <p className="text-xs sm:text-sm">{t('footer.tagline')}</p>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaHome className="flex-shrink-0" /> <span>Kigali</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaPhone className="flex-shrink-0" /> <span>+250-785-220-022</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaMailBulk className="flex-shrink-0" /> <span className="break-all">tresormugisha07@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaClock className="flex-shrink-0" /> <span>{t('footer.hours')}</span>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-white font-semibold uppercase text-sm">{t('footer.information')}</h4>
          <ul className="space-y-1 sm:space-y-1.5">
            {[
              t('footer.aboutUs'),
              t('footer.storeLocation'),
              t('footer.contactUs'),
              t('footer.shippingDelivery'),
            ].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-white font-semibold uppercase text-sm">{t('footer.ourServices')}</h4>
          <ul className="space-y-1 sm:space-y-1.5">
            {[
              t('footer.privacyPolicy'),
              t('footer.termsOfSales'),
              t('footer.customerServices'),
              t('footer.deliveryInfo'),
            ].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* My Account */}
        <div className="hidden lg:block space-y-2 sm:space-y-3">
          <h4 className="text-white font-semibold uppercase text-sm">{t('footer.myAccount')}</h4>
          <ul className="space-y-1 sm:space-y-1.5">
            {[
              t('footer.myShop'),
              t('footer.myCart'),
              t('common.checkout'),
              t('footer.myWishlist'),
              t('footer.trackingOrder'),
            ].map((item) => (
              <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2 lg:col-span-1 space-y-2 sm:space-y-3">
          <h4 className="text-white font-semibold uppercase text-sm">{t('footer.newsletter')}</h4>
          <p className="text-xs sm:text-sm">{t('footer.newsletterSub')}</p>
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 rounded sm:rounded-l-md sm:rounded-r-none"
            />
            <button className="bg-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white hover:bg-blue-700 transition-colors rounded sm:rounded-r-md sm:rounded-l-none mt-1 sm:mt-0">
              {t('footer.signUp')}
            </button>
          </div>
          <div className="flex gap-3 text-base text-gray-400">
            <FaFacebook className="hover:text-white cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-white cursor-pointer transition-colors" />
            <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
            <FaLinkedin className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 sm:mt-8 lg:mt-12 py-3 sm:py-4 lg:py-6 text-center text-xs sm:text-sm text-gray-400">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
