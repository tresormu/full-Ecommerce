import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartcontext";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import Layout from "./layout";
import type { Product } from "../../store/products";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2, MapPin, Mail, Phone, ChevronRight } from "lucide-react";

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
    momoPhone: '',
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
      const token = localStorage.getItem('token');
      if (!token) {
        alert(t('checkout.loginRequired'));
        navigate('/login');
        return;
      }
      if (formData.paymentMethod === 'momo' && !formData.momoPhone.trim()) {
        alert('Please enter your MoMo phone number.');
        setIsProcessing(false);
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
        paymentMethod: formData.paymentMethod as 'card' | 'momo',
        momoPhone: formData.paymentMethod === 'momo' ? formData.momoPhone : undefined,
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
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32 text-center h-full flex flex-col justify-center">
          <div className="bg-blue-50/50 backdrop-blur-sm inline-flex p-8 rounded-full mb-8 mx-auto animate-bounce-slow">
            <Truck className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 font-outfit tracking-tight">{t('common.cartEmpty')}</h1>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg leading-relaxed">{t('common.cartEmptySub')}</p>
          <button
            onClick={() => navigate("/Shop")}
            className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
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
      <div className="bg-[#F8FAFC] min-h-screen">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 lg:hidden flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <span className="font-bold text-lg font-outfit uppercase tracking-wider text-blue-600">Checkout</span>
          <div className="w-10" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-16">
          <div className="hidden lg:flex items-center gap-6 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
            </button>
            <div>
              <h1 className="text-5xl font-black text-gray-900 font-outfit tracking-tight">{t('checkout.title')}</h1>
              <p className="text-gray-500 text-lg mt-1 font-medium">{t('common.completePurchase')}</p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-12 flex lg:hidden bg-blue-600 text-white p-6 rounded-3xl mb-4 items-center justify-between shadow-lg shadow-blue-100">
              <div>
                <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-1">Items In Cart</p>
                <h2 className="text-2xl font-black">{formatPrice(total, total * 0.92, total * 1300)}</h2>
              </div>
              <ChevronRight className="w-8 h-8 opacity-50" />
            </div>

            {/* Delivery Info Section */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-100 border-none sm:shadow-none hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit tracking-tight">{t('common.billingDetails')}</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">Shipping Destination</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'firstName', label: t('checkout.firstName'), placeholder: 'Jane', span: false, icon: null },
                    { name: 'lastName', label: t('checkout.lastName'), placeholder: 'Doe', span: false, icon: null },
                    { name: 'email', label: t('checkout.email'), placeholder: 'jane@example.com', span: true, type: 'email', icon: <Mail className="w-4 h-4" /> },
                    { name: 'phone', label: t('checkout.phone'), placeholder: '+250 788 000 000', span: true, icon: <Phone className="w-4 h-4" /> },
                    { name: 'address', label: t('checkout.address'), placeholder: '123 Avenue, Kigali', span: true, icon: <MapPin className="w-4 h-4" /> },
                    { name: 'city', label: t('checkout.city'), placeholder: 'Kigali', span: false, icon: null },
                    { name: 'zipCode', label: t('checkout.zipCode'), placeholder: '0000', span: false, icon: null },
                  ].map(({ name, label, placeholder, span, type, icon }) => (
                    <div key={name} className={`space-y-2.5 ${span ? 'md:col-span-2' : ''}`}>
                      <div className="flex items-center gap-2 ml-1 text-gray-600">
                        {icon}
                        <label className="text-xs font-black uppercase tracking-widest">{label}</label>
                      </div>
                      <input
                        name={name}
                        type={type || 'text'}
                        value={(formData as any)[name]}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        required
                        className="w-full bg-gray-50/50 border-2 border-transparent px-6 py-5 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-100/50 focus:border-blue-600 transition-all outline-none font-medium placeholder:text-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method section */}
              <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit tracking-tight">{t('checkout.paymentMethod')}</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">Secure Transaction</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input
                      type="radio" name="paymentMethod" value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="ml-5 flex-1">
                      <span className="block font-black text-gray-900 text-sm tracking-tight">{t('checkout.card')}</span>
                      <span className="text-[10px] uppercase font-black text-blue-600 tracking-tighter opacity-70">Secured via Flutterwave</span>
                    </div>
                  </label>

                  <label className={`relative flex items-center p-6 border-2 rounded-3xl cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'momo' ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input
                      type="radio" name="paymentMethod" value="momo"
                      checked={formData.paymentMethod === 'momo'}
                      onChange={handleInputChange}
                      className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="ml-5 flex-1">
                      <span className="block font-black text-gray-900 text-sm tracking-tight">Mobile Money</span>
                      <span className="text-[10px] uppercase font-black text-blue-600 tracking-tighter opacity-70">MTN MoMo · Airtel</span>
                    </div>
                  </label>
                </div>

                {formData.paymentMethod === 'momo' && (
                  <div className="mt-6 space-y-2.5">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-1">MoMo Phone Number</label>
                    <input
                      name="momoPhone"
                      type="tel"
                      value={formData.momoPhone}
                      onChange={handleInputChange}
                      placeholder="+250 7XX XXX XXX"
                      required
                      className="w-full bg-gray-50/50 border-2 border-transparent px-6 py-5 rounded-2xl focus:bg-white focus:ring-8 focus:ring-blue-100/50 focus:border-blue-600 transition-all outline-none font-medium placeholder:text-gray-300"
                    />
                    <p className="text-[11px] text-gray-400 ml-1">Supports MTN MoMo (Rwanda/Uganda) and other Flutterwave-supported networks.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Order Summary section */}
            <div className="lg:col-span-5 sticky top-28">
              <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-2xl shadow-blue-900/10 border border-white">
                <h3 className="text-3xl font-black text-gray-900 mb-10 font-outfit tracking-tight">{t('common.yourOrder')}</h3>

                <div className="space-y-8 mb-10 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 line-clamp-1 text-lg mb-1">{item.name}</h4>
                        <div className="flex justify-between items-center">
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
                            Qty: {item.quantity}
                          </div>
                          <span className="font-black text-blue-600 text-lg">
                            {formatPrice(item.price * item.quantity, item.price * item.quantity * 0.92, item.price * item.quantity * 1300)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100">
                  <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>{t('common.subtotal')}</span>
                    <span className="text-gray-900 text-sm tracking-normal">{formatPrice(subtotal, subtotal * 0.92, subtotal * 1300)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>{t('common.shipping')}</span>
                    <span className="text-gray-900 text-sm tracking-normal">{formatPrice(shipping, shipping * 0.92, shipping * 1300)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900 pt-6 mt-4 border-t-2 border-dashed border-gray-50">
                    <span className="text-3xl font-black font-outfit tracking-tighter uppercase">{t('common.total')}</span>
                    <span className="text-4xl font-black text-blue-600 font-outfit tracking-tighter">
                      {formatPrice(total, total * 0.92, total * 1300)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-10 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-blue-200 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-4 group active:scale-95"
                >
                  {isProcessing
                    ? <Loader2 className="w-8 h-8 animate-spin" />
                    : <>
                        <ShieldCheck className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        <span className="uppercase tracking-widest text-sm">{t('common.placeOrder')}</span>
                      </>}
                </button>

                <div className="mt-8 flex items-center justify-center gap-3 text-gray-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white" />)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('common.secureCheckout')}</span>
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
