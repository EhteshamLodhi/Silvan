'use client';

import { useCart } from '../../../context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart, isUpdating } = useCart();
  
  const isAvailable = product?.availableForSale !== false; // handle null case gracefully
  const variantId = product?.variants?.edges?.[0]?.node?.id;

  return (
    <button 
      className="button-primary" 
      onClick={() => variantId && addToCart(variantId)}
      disabled={!isAvailable || isUpdating || !variantId}
      style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', opacity: (!isAvailable || isUpdating) ? 0.7 : 1 }}
    >
      {!isAvailable ? 'Out of Stock' : (isUpdating ? 'Adding...' : 'Add to Cart')}
    </button>
  );
}
