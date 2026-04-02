'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  cartCreateMutation,
  cartDiscountCodesUpdateMutation,
  cartLinesAddMutation,
  cartLinesRemoveMutation,
  cartLinesUpdateMutation,
  getCartQuery,
} from '../utils/shopify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [cartNotice, setCartNotice] = useState('');

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem('shopify_cart_id');
      if (storedCartId) {
        try {
          const data = await syncCart(getCartQuery, { id: storedCartId });
          if (data?.cart) {
            setCart(data.cart);
            return;
          }
        } catch (error) {
          console.error('Error fetching existing cart:', error);
        }
      }

      try {
        const data = await syncCart(cartCreateMutation, { input: {} });
        if (data?.cartCreate?.cart) {
          setCart(data.cartCreate.cart);
          localStorage.setItem('shopify_cart_id', data.cartCreate.cart.id);
        }
      } catch (error) {
        console.error('Error creating new cart:', error);
      }
    };

    initCart();
  }, []);

  async function syncCart(query, variables) {
    const res = await fetch('/api/shopify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    return json.data;
  }

  const addToCart = async (variantId, quantity = 1) => {
    if (!cart?.id) return;
    setIsUpdating(true);
    try {
      const data = await syncCart(cartLinesAddMutation, {
        cartId: cart.id,
        lines: [{ merchandiseId: variantId, quantity }],
      });
      if (data?.cartLinesAdd?.cart) {
        setCart(data.cartLinesAdd.cart);
        setCartNotice('');
        openCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLineQuantity = async (lineId, quantity) => {
    if (!cart?.id || !lineId) return;

    if (quantity <= 0) {
      return removeFromCart(lineId);
    }

    setIsUpdating(true);
    try {
      const data = await syncCart(cartLinesUpdateMutation, {
        cartId: cart.id,
        lines: [{ id: lineId, quantity }],
      });
      if (data?.cartLinesUpdate?.cart) {
        setCart(data.cartLinesUpdate.cart);
        setCartNotice('');
      }
    } catch (error) {
      console.error('Error updating cart line:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromCart = async (lineId) => {
    if (!cart?.id || !lineId) return;

    setIsUpdating(true);
    try {
      const data = await syncCart(cartLinesRemoveMutation, {
        cartId: cart.id,
        lineIds: [lineId],
      });
      if (data?.cartLinesRemove?.cart) {
        setCart(data.cartLinesRemove.cart);
        setCartNotice('');
      }
    } catch (error) {
      console.error('Error removing cart line:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const applyDiscountCode = async (code) => {
    if (!cart?.id) return { ok: false };

    setIsUpdating(true);
    setCartNotice('');
    try {
      const data = await syncCart(cartDiscountCodesUpdateMutation, {
        cartId: cart.id,
        discountCodes: code ? [code] : [],
      });
      if (data?.cartDiscountCodesUpdate?.cart) {
        setCart(data.cartDiscountCodesUpdate.cart);
      }

      const warnings = data?.cartDiscountCodesUpdate?.warnings || [];
      const userErrors = data?.cartDiscountCodesUpdate?.userErrors || [];
      const discount = data?.cartDiscountCodesUpdate?.cart?.discountCodes?.[0];
      if (discount?.applicable) {
        setCartNotice(`Discount code ${discount.code} applied.`);
        return { ok: true };
      }

      if (warnings.length) {
        setCartNotice(warnings[0].message);
      } else if (userErrors.length) {
        setCartNotice(userErrors[0].message);
      } else if (code) {
        setCartNotice(`Discount code ${code} could not be applied.`);
      }

      return { ok: false };
    } catch (error) {
      console.error('Error applying discount code:', error);
      setCartNotice('Unable to apply discount code right now.');
      return { ok: false };
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cart,
        addToCart,
        updateLineQuantity,
        removeFromCart,
        applyDiscountCode,
        isUpdating,
        cartNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
