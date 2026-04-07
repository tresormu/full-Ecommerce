import { useParams } from "react-router-dom";
import { ProductsService } from "../../services/productSetUp";
import { useState, useEffect } from "react";
import { useCart } from "../layouts/cartcontext";
import Layout from "../layouts/layout";
import { PageLoader } from "../ui/LoadingSpinner";
import type { ProductResponse } from "../../services/productSetUp";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";
import { Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductPage() {
  const { t } = useTranslation();
  const { formatPrice } = useLocale();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id || id === "0" || !/^[0-9a-fA-F]{24}$/.test(id)) {
          setError(t('product.notFound'));
          setLoading(false);
          return;
        }
        const data = await ProductsService.getProduct(id);
        setProduct(data);
        if (data?.Images?.[0]) setActiveImage(data.Images[0]);
      } catch {
        setError(t('product.notFound'));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, t]);

  if (loading) return <PageLoader />;
  if (error || !product)
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{error || t('product.notFound')}</h1>
        </div>
      </Layout>
    );

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      breadcrumb: "",
      images: product.Images,
      price: product.price,
      category: product.category.name,
      description: "",
      sku: product._id,
      availability: product.inStock ? "In Stock" : ("Out of Stock" as "In Stock" | "Out of Stock"),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm font-medium">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li><span className="hover:text-blue-600 cursor-pointer transition-colors">{t('nav.home')}</span></li>
              <li><span className="mx-2">/</span></li>
              <li><span className="hover:text-blue-600 cursor-pointer transition-colors">{t('nav.shop')}</span></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={activeImage || product.Images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {product.Images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      (activeImage || product.Images[0]) === img
                        ? "border-blue-600 ring-2 ring-blue-600/10 scale-95"
                        : "border-gray-100 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category.name}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-gray-700">4.8</span>
                    <span className="text-sm text-gray-400">({t('product.reviews', { count: 120 })})</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight break-words">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-2xl sm:text-4xl font-bold text-blue-600">
                  {formatPrice(product.priceUSD ?? product.price, product.priceEUR ?? product.price * 0.92, product.priceRWF ?? product.price * 1300)}
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-gray-400 line-through font-medium">
                    {formatPrice(product.oldPrice, product.oldPrice * 0.92, product.oldPrice * 1300)}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="bg-rose-100 text-rose-700 text-sm font-bold px-2 py-1 rounded-lg">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                {product.description}
              </p>

              <div className="space-y-8 mb-10">
                <div>
                  <span className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    {t('product.size')}
                  </span>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        className={`w-12 h-12 flex items-center justify-center border-2 rounded-xl text-sm font-bold transition-all ${
                          (product.size || "M") === size
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-100 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-transparent text-center font-bold text-gray-900 border-none focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                    addedToCart
                      ? "bg-blue-700 text-white shadow-blue-200"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1"
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {addedToCart ? t('common.addedToCart') : t('common.addToCart')}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{t('product.freeShipping')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{t('product.easyReturns')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{t('product.warranty')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
