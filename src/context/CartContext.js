"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

// =====================================================
// CONVERT FILE -> DATA URL
// =====================================================

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(
        new Error("Failed to convert image to data URL")
      );
    };

    reader.readAsDataURL(file);
  });
}

// =====================================================
// CONVERT DATA URL -> FILE
// =====================================================

export async function dataURLToFile(
  dataUrl,
  fileName,
  mimeType
) {
  const response = await fetch(dataUrl);

  const blob = await response.blob();

  return new File(
    [blob],
    fileName || "uploaded-image",
    {
      type:
        mimeType ||
        blob.type ||
        "image/jpeg",
    }
  );
}

// =====================================================
// CART PROVIDER
// =====================================================

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const [cartLoaded, setCartLoaded] = useState(false);

  // =====================================================
  // LOAD CART FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // =====================================================
  // SAVE CART TO LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    if (!cartLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart, cartLoaded]);

  // =====================================================
  // ADD TO CART
  // =====================================================

  async function addToCart(product) {
    try {
      // -------------------------------------------------
      // COPY CUSTOM VALUES
      // -------------------------------------------------

      const originalCustomValues =
        product.custom_values || {};

      const convertedCustomValues = {};

      // -------------------------------------------------
      // CONVERT FILES TO DATA URL
      // -------------------------------------------------

      for (const [
        fieldId,
        value,
      ] of Object.entries(
        originalCustomValues
      )) {
        if (value instanceof File) {
          console.log(
            "Converting image to data URL:",
            value.name
          );

          const dataUrl =
            await fileToDataURL(value);

          convertedCustomValues[fieldId] = {
            type: "image",

            name: value.name,

            mimeType: value.type,

            dataUrl: dataUrl,
          };
        } else {
          convertedCustomValues[fieldId] =
            value;
        }
      }

      // -------------------------------------------------
      // CREATE CART PRODUCT
      // -------------------------------------------------

      const productForCart = {
        ...product,

        custom_values:
          convertedCustomValues,
      };

      setCart((previousCart) => {
        // ------------------------------------------------
        // FIND SAME PRODUCT + SAME CUSTOMIZATION
        // ------------------------------------------------

        const existingItem =
          previousCart.find(
            (item) =>
              item.product_id ===
                productForCart.product_id &&
              JSON.stringify(
                item.custom_values || {}
              ) ===
                JSON.stringify(
                  productForCart.custom_values ||
                    {}
                )
          );

        // ------------------------------------------------
        // SAME PRODUCT EXISTS
        // ------------------------------------------------

        if (existingItem) {
          return previousCart.map(
            (item) =>
              item.cart_id ===
              existingItem.cart_id
                ? {
                    ...item,

                    quantity:
                      Number(
                        item.quantity || 1
                      ) +
                      Number(
                        productForCart.quantity ||
                          1
                      ),
                  }
                : item
          );
        }

        // ------------------------------------------------
        // NEW CART ITEM
        // ------------------------------------------------

        const newItem = {
          ...productForCart,

          cart_id:
            Date.now().toString() +
            Math.random()
              .toString(36)
              .substring(2),

          quantity:
            productForCart.quantity || 1,
        };

        return [
          ...previousCart,
          newItem,
        ];
      });

      console.log(
        "PRODUCT ADDED TO CART:",
        productForCart
      );
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );

      alert(
        "There was a problem adding the image to your cart."
      );
    }
  }

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  function removeFromCart(cartId) {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          item.cart_id !== cartId
      )
    );
  }

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  function increaseQuantity(cartId) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.cart_id === cartId
          ? {
              ...item,
              quantity:
                Number(
                  item.quantity || 1
                ) + 1,
            }
          : item
      )
    );
  }

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  function decreaseQuantity(cartId) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.cart_id === cartId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Number(
                  item.quantity || 1
                ) - 1
              ),
            }
          : item
      )
    );
  }

  // =====================================================
  // CLEAR CART
  // =====================================================

  function clearCart() {
    setCart([]);
  }

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(
          item.base_price || 0
        ) *
          Number(
            item.quantity || 1
          ),
      0
    );

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    cart,

    addToCart,

    removeFromCart,

    increaseQuantity,

    decreaseQuantity,

    clearCart,

    cartTotal,

    dataURLToFile,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================================
// USE CART
// =====================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}