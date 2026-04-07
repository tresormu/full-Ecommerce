import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../layouts/cartcontext";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cart, increaseQty, decreaseQty } = useCart();

  const subtotal = cart?.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0,
  ) || 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[380px] max-w-full bg-white z-50 transition-transform flex flex-col shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center">
          <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded transition-colors">
            <ChevronLeft size={22} />
          </button>
          <h2 className="flex-1 text-center font-bold uppercase text-sm">
            My Cart
          </h2>
        </div>

        {!cart || cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 px-4 text-center">
            <p className="uppercase text-sm mb-4">Shopping cart is empty!</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item) => (
                <div key={item?.id} className="flex gap-3 border-b pb-4">
                  <img src={item?.images?.[0] || '/placeholder.jpg'} className="w-16 h-20 object-cover rounded" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">${item?.price || 0}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => decreaseQty(item?.id)} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center">{item?.quantity || 0}</span>
                      <button onClick={() => increaseQty(item?.id)} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <Trash2
                    size={18}
                    className="text-gray-400 cursor-pointer hover:text-red-500 shrink-0 mt-1"
                    onClick={() => decreaseQty(item?.id)}
                  />
                </div>
              ))}
            </div>
            <div className="border-t p-4">
              <div className="flex justify-between font-semibold mb-4">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Link
                to="/carts"
                className="bg-blue-600 text-white w-full py-3 text-center block mb-2 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                className="bg-orange-500 text-white w-full py-3 text-center block rounded font-medium hover:bg-orange-600 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
