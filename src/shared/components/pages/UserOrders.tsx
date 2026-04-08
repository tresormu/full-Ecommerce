import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import Layout from "../layouts/layout";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";
import { Package, ChevronRight, MapPin, XCircle, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

interface Order {
  _id: string;
  orderId: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  total: number;
  totalAmount: number;
  status: string;
  customerInfo: { name: string; email: string; phone: string; address: string };
  createdAt: string;
  timeOrderPlaced: string;
  paymentMethod: string;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useLocale();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    fetchOrders(1);
  }, [navigate]);

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      const data = await orderService.getUserOrders(page);
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId);
    try {
      await orderService.cancelOrder(orderId);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o)));
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancellingOrder(null);
    }
  };

  const statusStyle = (status: string) => {
    const map: Record<string, { bg: string, text: string, dot: string }> = {
      pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
      processing: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
      shipped: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
      delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
      cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-400" },
    };
    return map[status.toLowerCase()] ?? { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-6 lg:py-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 font-outfit tracking-tight">{t("orders.title")}</h1>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Purchase History</p>
            </div>
            <button 
              onClick={() => navigate("/Shop")}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop All</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-12 lg:p-20 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 font-outfit tracking-tight">{t("orders.empty")}</h2>
              <p className="text-gray-400 mb-10 max-w-xs mx-auto font-medium leading-relaxed">It looks like you haven't placed any orders yet. Start shopping to fill this space!</p>
              <button
                onClick={() => navigate("/Shop")}
                className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] hover:bg-blue-700 font-black transition-all shadow-xl shadow-blue-200 active:scale-95 uppercase tracking-widest text-sm"
              >
                {t("common.continueShopping")}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => {
                  const style = statusStyle(order.status);
                  return (
                    <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 group">
                      <div className="p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                          <div className="flex items-center gap-4">
                            <div className="bg-[#F8FAFC] p-4 rounded-3xl group-hover:bg-blue-50 transition-colors duration-500">
                              <Package className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-gray-900 font-outfit tracking-tight">#{order.orderId || order._id.slice(-8).toUpperCase()}</h3>
                              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                                Ordered {new Date(order.createdAt || order.timeOrderPlaced).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${style.bg} ${style.text}`}>
                              <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
                              <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                            </div>
                            
                            {["pending", "processing"].includes(order.status.toLowerCase()) && (
                              <button
                                onClick={() => setConfirmCancelId(order._id)}
                                disabled={cancellingOrder === order._id}
                                className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                title="Cancel Order"
                              >
                                <XCircle className="w-6 h-6" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                          <div className="lg:col-span-2 space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Ordered Items</h4>
                            <div className="space-y-4">
                              {(order.items || []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-colors">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-blue-600 shadow-sm text-xs">
                                      {item.quantity}x
                                    </div>
                                    <span className="font-bold text-gray-900">{item.name}</span>
                                  </div>
                                  <span className="font-black text-blue-600">
                                    {formatPrice(item.price * item.quantity, item.price * item.quantity * 0.92, item.price * item.quantity * 1300)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-[#F8FAFC] rounded-[2rem] p-8 space-y-6">
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Total Amount</h4>
                                <p className="text-4xl font-black text-blue-600 font-outfit tracking-tighter">
                                  {formatPrice(order.total || order.totalAmount, (order.total || order.totalAmount) * 0.92, (order.total || order.totalAmount) * 1300)}
                                </p>
                            </div>
                            
                            <div className="pt-6 border-t border-gray-200/50">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Ship To</h4>
                              <div className="flex gap-3 text-gray-600">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="text-xs font-bold leading-relaxed">
                                  <p>{order.customerInfo?.name}</p>
                                  <p className="opacity-60">{order.customerInfo?.address}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 py-10">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchOrders(pagination.page - 1)}
                    className="p-4 bg-white rounded-2xl border border-gray-100 disabled:opacity-30 disabled:grayscale hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-5 h-5 text-blue-600" />
                  </button>
                  <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm font-black text-sm tracking-widest text-gray-400">
                    <span className="text-blue-600">{pagination.page}</span> / {pagination.pages}
                  </div>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => fetchOrders(pagination.page + 1)}
                    className="p-4 bg-white rounded-2xl border border-gray-100 disabled:opacity-30 disabled:grayscale hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <XCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-4 font-outfit">{t("orders.cancel")}</h3>
            <p className="text-gray-400 text-center font-medium mb-10">{t("orders.cancelConfirm")}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-4 border-2 border-gray-100 rounded-[1.5rem] font-black text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={() => { handleCancelOrder(confirmCancelId); setConfirmCancelId(null); }}
                className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-rose-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
