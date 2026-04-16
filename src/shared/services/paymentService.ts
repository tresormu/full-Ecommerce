const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://tresore-commerce.andasy.dev/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const paymentService = {
  createCheckoutSession: async (payload: {
    orderId: string;
    callbackUrl: string;
    amount: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    paymentMethod?: 'card' | 'momo';
    momoPhone?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/payment/checkout-session`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Failed to create payment session");
    }
    return response.json();
  },

  verifyPayment: async (txRef: string, flwId?: string) => {
    const query = flwId ? `?flwId=${encodeURIComponent(flwId)}` : "";
    const response = await fetch(
      `${API_BASE_URL}/payment/verify/${encodeURIComponent(txRef)}${query}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Failed to verify payment");
    }
    return response.json();
  },
};
