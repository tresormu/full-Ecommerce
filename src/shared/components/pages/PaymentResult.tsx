import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../layouts/layout";
import { paymentService } from "../../services/paymentService";
import { orderService } from "../../services/orderService";

type ResultState = "loading" | "success" | "failed" | "pending" | "error";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [state, setState] = useState<ResultState>("loading");
  const [message, setMessage] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  const txRef = useMemo(() => params.get("tx_ref") || "", [params]);
  const flwId = useMemo(() => params.get("transaction_id") || "", [params]);
  const statusParam = useMemo(() => params.get("status") || "", [params]);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (!txRef) {
        setState("error");
        setMessage("Missing payment reference. Please contact support.");
        return;
      }

      try {
        const result = await paymentService.verifyPayment(txRef, flwId || undefined);
        if (!mounted) return;

        const finalStatus = result?.status;
        setOrderId(result?.orderId || "");

        if (finalStatus === "completed") {
          setState("success");
          setMessage("Payment successful. Thank you for your purchase!");

          const user = localStorage.getItem("user");
          if (user && user !== "undefined") {
            const userData = JSON.parse(user);
            const cartName = `${userData.username}_cart`;
            await orderService.clearCart(cartName);
          }
        } else if (finalStatus === "failed") {
          setState("failed");
          setMessage("Payment failed. Please try again.");
        } else {
          setState("pending");
          setMessage(
            statusParam
              ? `Payment is ${statusParam}. We will update your order soon.`
              : "Payment is pending. Please refresh shortly.",
          );
        }
      } catch (error: any) {
        if (!mounted) return;
        setState("error");
        setMessage(error?.message || "Unable to verify payment.");
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [txRef, flwId, statusParam]);

  const isSuccess = state === "success";
  const isFailed = state === "failed";
  const isPending = state === "pending";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div
          className={`border rounded-lg p-8 ${
            isSuccess
              ? "bg-green-50 border-green-200"
              : isFailed
                ? "bg-red-50 border-red-200"
                : isPending
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-gray-50 border-gray-200"
          }`}
        >
          <h1 className="text-3xl font-bold mb-4">
            {isSuccess && "Payment Successful"}
            {isFailed && "Payment Failed"}
            {isPending && "Payment Pending"}
            {state === "loading" && "Verifying Payment"}
            {state === "error" && "Payment Verification Error"}
          </h1>
          <p className="text-lg mb-6">{message}</p>
          {orderId && (
            <p className="text-sm text-gray-600 mb-6">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <div className="flex gap-4 justify-center">
            {isSuccess && (
              <button
                onClick={() => navigate("/orders")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                View My Orders
              </button>
            )}
            {(isFailed || isPending || state === "error") && (
              <button
                onClick={() => navigate("/Carts")}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
              >
                Back to Cart
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentResult;
