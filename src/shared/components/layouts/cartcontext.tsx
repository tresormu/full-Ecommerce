import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cartService";
import { orderService } from "../../services/orderService";
import type { Product } from "../../store/products";
import { Toast, useToast } from "../ui/Toast";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartName, setCartName] = useState<string>("");
  const queryClient = useQueryClient();
  const { toasts, showToast, removeToast } = useToast();

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      if (cartName) {
        try {
          const cartData = await orderService.getCartItems(cartName);
          if (cartData && cartData.items) {
            setCart(cartData.items);
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
          // Load from localStorage as fallback
          const localCart = localStorage.getItem(cartName);
          if (localCart) {
            try {
              setCart(JSON.parse(localCart));
            } catch (e) {
              console.error('Failed to parse local cart:', e);
            }
          }
        }
      }
    };

    loadCart();
  }, [cartName]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartName && cart.length > 0) {
      localStorage.setItem(cartName, JSON.stringify(cart));
    }
  }, [cart, cartName]);

  // Get user cart name
  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem('user');
      if (user && user !== 'undefined') {
        try {
          const userData = JSON.parse(user);
          setCartName(`${userData.username}_cart`);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setCartName("");
      }
    };

    checkUser();
    
    // Listen for user updates
    const handleUserUpdate = () => {
      checkUser();
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const addToCart = async (product: Product) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser || currentUser === 'undefined') {
      alert('Please login to add items to cart');
      return;
    }

    let currentCartName = cartName;
    if (!currentCartName) {
      try {
        const userData = JSON.parse(currentUser);
        currentCartName = `${userData.username}_cart`;
        setCartName(currentCartName);
      } catch (error) {
        alert('Please login to add items to cart');
        return;
      }
    }

    // Check current quantity in cart
    const existingItem = cart.find((item) => item.id === product.id);
    
    // For now, we'll allow adding to cart and let the backend handle stock validation
    // In a real app, you might want to check stock availability here
    
    // Update local state immediately
    const newCart = (() => {
      if (existingItem) {
        return cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...cart, { ...product, quantity: 1 }];
    })();
    
    setCart(newCart);
    localStorage.setItem(currentCartName, JSON.stringify(newCart));

    // Show success toast
    showToast(`${product.name} added to cart!`, 'success');

    // Sync with backend
    try {
      await addToCartMutation.mutateAsync({
        CartName: currentCartName,
        ProductName: product.name,
        quantity: 1
      });
    } catch (error) {
      console.error('Failed to sync cart with backend:', error);
      // Revert local state if backend sync fails
      setCart(cart);
      localStorage.setItem(currentCartName, JSON.stringify(cart));
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const increaseQty = async (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item && cartName) {
      const newCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      setCart(newCart);
      localStorage.setItem(cartName, JSON.stringify(newCart));
      
      try {
        await addToCartMutation.mutateAsync({
          CartName: cartName,
          ProductName: item.name,
          quantity: 1
        });
      } catch (error) {
        console.error('Failed to sync quantity increase:', error);
        // Revert on error
        setCart(cart);
        localStorage.setItem(cartName, JSON.stringify(cart));
      }
    }
  };

  const decreaseQty = async (id: string) => {
    const item = cart.find(item => item.id === id);
    if (item && cartName) {
      if (item.quantity === 1) {
        // Remove from cart
        const newCart = cart.filter((item) => item.id !== id);
        setCart(newCart);
        localStorage.setItem(cartName, JSON.stringify(newCart));
        try {
          await removeFromCartMutation.mutateAsync({
            CartName: cartName,
            ProductName: item.name
          });
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          // Revert on error
          setCart(cart);
          localStorage.setItem(cartName, JSON.stringify(cart));
        }
      } else {
        // Decrease quantity
        const newCart = cart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        );
        setCart(newCart);
        localStorage.setItem(cartName, JSON.stringify(newCart));
        // Note: Backend might not have a decrease quantity endpoint, 
        // so we just update locally for now
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      increaseQty, 
      decreaseQty,
      isLoading: addToCartMutation.isPending || removeFromCartMutation.isPending
    }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};