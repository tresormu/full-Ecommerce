import Layout from "../layouts/layout";
import { useWishlist } from "../layouts/wishlistcontext";
import ProductHomeCard from "../ui/ProductCard";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";

export default function Favourites() {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-100 text-center py-14">
          <h1 className="text-3xl font-bold text-gray-900">{t('wishlist.title')}</h1>
          <p className="text-gray-500 mt-2">{t('wishlist.subtitle')}</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart className="w-10 h-10 text-blue-300" />
          </div>
          <p className="text-gray-500 text-lg mb-8">{t('wishlist.empty')}</p>
          <a
            href="/Shop"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            {t('wishlist.returnToShop')}
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 text-center py-14">
        <h1 className="text-3xl font-bold text-gray-900">{t('wishlist.title')}</h1>
        <p className="text-gray-500 mt-2">
          {t('wishlist.subtitle')} — {t(`wishlist.itemCount_${wishlist.length === 1 ? 'one' : 'other'}`, { count: wishlist.length })}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="relative">
              <ProductHomeCard {...product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-4 right-4 z-20 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                title="Remove from wishlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
