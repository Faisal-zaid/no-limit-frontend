"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  function addToCart(product) {
    setCart((previousCart) => {
      /*
        We deliberately DON'T merge products just because
        they have the same product_id.

        Example:

        T-Shirt
        Size: Large
        Color: Black

        and

        T-Shirt
        Size: Small
        Color: White

        are two different cart items.
      */

      return [
        ...previousCart,
        {
          ...product,
          cart_id: Date.now() + Math.random(),
        },
      ];
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
      previousCart.map((item) =>
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
  // TOTAL ITEMS
  // ==========================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.base_price) *
        Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ==========================================
// USE CART
// ==========================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}