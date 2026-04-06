import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import Layout from "../layouts/layout";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../context/LocaleContext";

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
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useLocale();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(Array.isArray(data) ? data : data.orders || []);
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

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status.toLowerCase()] ?? "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        {confirmCancelId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-red-500 text-lg">✕</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t("orders.cancel")}</p>
                  <p className="text-xs text-gray-400">{t("orders.cancelConfirm")}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setConfirmCancelId(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  No
                </button>
                <button onClick={() => { handleCancelOrder(confirmCancelId!); setConfirmCancelId(null); }}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-blue-600 text-white text-center py-14">
        <h1 className="text-3xl font-bold">{t("orders.title")}</h1>
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p className="text-gray-500 mb-6 text-lg">{t("orders.empty")}</p>
              <button
                onClick={() => navigate("/Shop")}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                {t("common.continueShopping")}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {t("orders.orderNumber")} #{order.orderId || order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("orders.placedOn")} {new Date(order.createdAt || order.timeOrderPlaced).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {["pending", "processing"].includes(order.status.toLowerCase()) && (
                        <button
                          onClick={() => setConfirmCancelId(order._id)}
                          disabled={cancellingOrder === order._id}
                          className="px-4 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          {cancellingOrder === order._id ? t("orders.cancelling") : t("orders.cancel")}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-4">{t("orders.items")}</h4>
                      <div className="space-y-3">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div>
                              <p className="font-medium text-gray-900">{item.name || "Unknown Product"}</p>
                              <p className="text-sm text-gray-500">{t("common.quantity")}: {item.quantity || 0}</p>
                            </div>
                            <p className="font-semibold text-blue-600">
                              {formatPrice(
                                (item.price || 0) * (item.quantity || 0),
                                (item.price || 0) * (item.quantity || 0) * 0.92,
                                (item.price || 0) * (item.quantity || 0) * 1300,
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">{t("orders.summary")}</h4>
                      <div className="space-y-2 text-sm bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t("common.total")}:</span>
                          <span className="font-bold text-blue-600">
                            {formatPrice(
                              order.total || order.totalAmount || 0,
                              (order.total || order.totalAmount || 0) * 0.92,
                              (order.total || order.totalAmount || 0) * 1300,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t("checkout.paymentMethod")}:</span>
                          <span className="font-medium capitalize">{order.paymentMethod || "N/A"}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="font-semibold text-gray-900 mb-2">{t("orders.deliveryAddress")}</h5>
                        <p className="text-sm text-gray-600">{order.customerInfo?.name || "N/A"}</p>
                        <p className="text-sm text-gray-600">{order.customerInfo?.address || "N/A"}</p>
                        <p className="text-sm text-gray-600">{order.customerInfo?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
