import {
  FaHome, FaPhone, FaMailBulk, FaClock,
  FaFacebook, FaInstagram, FaTwitter, FaLinkedin,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-8 lg:pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Mobile: 2-col pill grid | Desktop: 5-col */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-3">
            <h3 className="text-white text-lg font-bold">B-DIFFERENT</h3>
            <p className="text-xs sm:text-sm">{t('footer.tagline')}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5"><FaHome className="shrink-0" /> Kigali</span>
              <span className="flex items-center gap-1.5"><FaPhone className="shrink-0" /> +250-785-220-022</span>
              <span className="flex items-center gap-1.5"><FaMailBulk className="shrink-0" /> tresormugisha07@gmail.com</span>
              <span className="flex items-center gap-1.5"><FaClock className="shrink-0" /> {t('footer.hours')}</span>
            </div>
            <div className="flex gap-4 text-lg text-gray-400 pt-1">
              <FaFacebook className="hover:text-white cursor-pointer transition-colors" />
              <FaInstagram className="hover:text-white cursor-pointer transition-colors" />
              <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
              <FaLinkedin className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Information */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider">{t('footer.information')}</h4>
            <ul className="space-y-2">
              {[t('footer.aboutUs'), t('footer.storeLocation'), t('footer.contactUs'), t('footer.shippingDelivery')].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider">{t('footer.ourServices')}</h4>
            <ul className="space-y-2">
              {[t('footer.privacyPolicy'), t('footer.termsOfSales'), t('footer.customerServices'), t('footer.deliveryInfo')].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider">{t('footer.myAccount')}</h4>
            <ul className="space-y-2">
              {[t('footer.myShop'), t('footer.myCart'), t('common.checkout'), t('footer.myWishlist'), t('footer.trackingOrder')].map((item) => (
                <li key={item} className="hover:text-white cursor-pointer text-xs sm:text-sm transition-colors">{item}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <h4 className="text-white font-semibold uppercase text-xs tracking-wider">{t('footer.newsletter')}</h4>
            <p className="text-xs sm:text-sm">{t('footer.newsletterSub')}</p>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 rounded-l-md"
              />
              <button className="bg-blue-600 px-3 py-2 text-xs sm:text-sm text-white hover:bg-blue-700 transition-colors rounded-r-md shrink-0">
                {t('footer.signUp')}
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 lg:mt-12 py-4 text-center text-xs text-gray-400">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
