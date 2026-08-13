"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ==========================================
  // LOAD CART FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  // ==========================================
  // SAVE CART TO LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cart]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart(product) {
    setCart((previousCart) => {
      /*
       * We use cart_id instead of product_id as the
       * unique identifier because the same product can
       * have different customizations.
       */

      const existingItem = previousCart.find(
        (item) =>
          item.product_id === product.product_id &&
          JSON.stringify(item.custom_values || {}) ===
            JSON.stringify(product.custom_values || {})
      );

      // If same product + same customization already exists
      if (existingItem) {
        return previousCart.map((item) =>
          item.cart_id === existingItem.cart_id
            ? {
                ...item,
                quantity:
                  item.quantity + product.quantity,
              }
            : item
        );
      }

      // Otherwise create a new cart item
      const newItem = {
        ...product,

        cart_id:
          Date.now().toString() +
          Math.random().toString(36).substring(2),

        quantity: product.quantity || 1,

        custom_values:
          product.custom_values || {},
      };

      return [...previousCart, newItem];
    });
  }

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  function removeFromCart(cartId) {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.cart_id !== cartId
      )
    );
  }

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  function increaseQuantity(cartId) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.cart_id === cartId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  function decreaseQuantity(cartId) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.cart_id === cartId
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  item.quantity - 1
                ),
              }
            : item
        )
    );
  }

  // ==========================================
  // CLEAR CART
  // ==========================================

  function clearCart() {
    setCart([]);
  }

  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.base_price || 0) *
        Number(item.quantity || 1),
    0
  );

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ==========================================
// useCart HOOK
// ==========================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}