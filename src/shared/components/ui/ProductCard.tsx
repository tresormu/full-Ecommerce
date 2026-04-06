import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useWishlist } from "../layouts/wishlistcontext";
import { useCart } from "../layouts/cartcontext";
import type { Product } from "../../store/products";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";

export default function ProductHomeCard(props: Product) {
  const { t } = useTranslation();
  const { formatPrice } = useLocale();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(props.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) removeFromWishlist(props.id);
    else addToWishlist(props);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(props);
  };

  const discountPercentage = props.oldPrice
    ? Math.round(((props.oldPrice - props.price) / props.oldPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 rounded-2xl overflow-hidden border border-gray-100 m-1 sm:m-2 lg:m-3">
      <Link to={`/product/${props.id}`} className="relative block h-full">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {props.oldPrice && (
            <span className="bg-rose-500 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white rounded-lg shadow-sm">
              {discountPercentage}% {t('home.off')}
            </span>
          )}
          <span className="bg-blue-600 px-2.5 py-1 text-[8px] sm:text-[10px] font-bold uppercase text-white rounded-lg shadow-sm">
            {t('home.featured')}
          </span>
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 z-20 rounded-full bg-white/90 backdrop-blur-sm p-2 transition-all duration-300 hover:bg-white shadow-md active:scale-90"
        >
          {inWishlist
            ? <FaHeart size={16} className="text-red-500" />
            : <FaRegHeart size={16} className="text-gray-400 hover:text-red-500" />}
        </button>

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {props.images && (
            <img
              src={props.images[0]}
              alt={props.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="mb-2 text-sm font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
            {props.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-bold text-blue-600 text-lg">
              {formatPrice(props.price, (props as any).priceEUR ?? props.price * 0.92, (props as any).priceRWF ?? props.price * 1300)}
            </span>
            {props.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(props.oldPrice, (props as any).priceEUR ?? props.oldPrice * 0.92, (props as any).priceRWF ?? props.oldPrice * 1300)}
              </span>
            )}
          </div>

          <div className="mt-auto">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              props.availability === 'In Stock'
                ? 'text-teal-600 bg-teal-50'
                : 'text-rose-600 bg-rose-50'
            }`}>
              {t(`common.${props.availability === 'In Stock' ? 'inStock' : 'outOfStock'}`)}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 shadow-md shadow-blue-200"
        >
          <FaShoppingCart size={14} />
          {t('common.addToCart')}
        </button>
      </div>
    </div>
  );
}
