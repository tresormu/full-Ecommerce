import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartcontext";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import Layout from "./layout";
import type { Product } from "../../store/products";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

interface CartItem extends Product {
  quantity: number;
}

const Checkout = () => {
  const { t } = useTranslation();
  const { formatPrice } = useLocale();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zipCode: '', paymentMethod: 'card',
  });

  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
  const shipping = cart.length ? 5 : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined') {
        alert(t('checkout.loginRequired'));
        navigate('/login');
        return;
      }
      const orderData = {
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email, phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        },
        items: cart.map(item => ({ productId: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total, paymentMethod: formData.paymentMethod,
      };
      const result = await orderService.createOrder(orderData);
      const orderId = result?.order?._id || result?._id;
      if (!orderId) throw new Error("Order creation failed");
      const callbackUrl = `${window.location.origin}/payment-result`;
      const session = await paymentService.createCheckoutSession({
        orderId, callbackUrl,
        amount: total,
        customerName: orderData.customerInfo.name,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phone,
      });
      if (!session?.paymentUrl) throw new Error("Payment session failed");
      window.location.href = session.paymentUrl;
    } catch (error) {
      console.error('Order failed:', error);
      alert(t('checkout.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-32 text-center">
          <div className="bg-blue-50 inline-flex p-6 rounded-full mb-6">
            <Truck className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('common.cartEmpty')}</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t('common.cartEmptySub')}</p>
          <button
            onClick={() => navigate("/Shop")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.continueShopping')}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50/50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-16">
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">{t('checkout.title')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('common.completePurchase')}</p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t('common.billingDetails')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { name: 'firstName', label: t('checkout.firstName'), placeholder: 'Jane', span: false },
                    { name: 'lastName', label: t('checkout.lastName'), placeholder: 'Doe', span: false },
                    { name: 'email', label: t('checkout.email'), placeholder: 'jane@example.com', span: true, type: 'email' },
                    { name: 'address', label: t('checkout.address'), placeholder: '123 Main St', span: true },
                    { name: 'city', label: t('checkout.city'), placeholder: 'Kigali', span: false },
                    { name: 'zipCode', label: t('checkout.zipCode'), placeholder: '00100', span: false },
                  ].map(({ name, label, placeholder, span, type }) => (
                    <div key={name} className={`space-y-2 ${span ? 'md:col-span-2' : ''}`}>
                      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
                      <input
                        name={name}
                        type={type || 'text'}
                        value={(formData as any)[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        required
                        className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t('checkout.paymentMethod')}</h2>
                </div>
                <label className="relative flex items-center p-6 border-2 border-blue-600 bg-blue-50/30 rounded-2xl cursor-pointer">
                  <input
                    type="radio" name="paymentMethod" value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-4 flex-1">
                    <span className="block font-bold text-gray-900">{t('checkout.card')}</span>
                    <span className="text-sm text-gray-500">{t('common.securePayment')}</span>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-600 opacity-20" />
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('common.yourOrder')}</h3>

                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-500">{t('common.qty')}: {item.quantity}</span>
                          <span className="font-bold text-blue-600">
                            {formatPrice(item.price * item.quantity, item.price * item.quantity * 0.92, item.price * item.quantity * 1300)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>{t('common.subtotal')}</span>
                    <span>{formatPrice(subtotal, subtotal * 0.92, subtotal * 1300)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>{t('common.shipping')}</span>
                    <span>{formatPrice(shipping, shipping * 0.92, shipping * 1300)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900 pt-4">
                    <span className="text-xl font-bold">{t('common.total')}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                      {formatPrice(total, total * 0.92, total * 1300)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-100 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
                >
                  {isProcessing
                    ? <Loader2 className="w-6 h-6 animate-spin" />
                    : <><ShieldCheck className="w-6 h-6" />{t('common.placeOrder')}</>}
                </button>

                <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-medium tracking-wide uppercase">{t('common.secureCheckout')}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
