"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    setCart((previousCart) => [
      ...previousCart,
      {
        ...item,
        cart_id: Date.now(),
      },
    ]);
  }

  function removeFromCart(cartId) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.cart_id !== cartId)
    );
  }

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

  function decreaseQuantity(cartId) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.cart_id === cartId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.base_price) * item.quantity,
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
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}