'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cart, isUpdating, removeFromCart } = useCart();

  const lines = cart?.lines?.edges || [];
  const totalAmount = Number(cart?.cost?.totalAmount?.amount || 0);
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || 'USD';

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={closeCart} />
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            Your Cart{' '}
            {isUpdating ? (
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.7 }}>
                (Syncing...)
              </span>
            ) : null}
          </h2>
          <button className="close-button" onClick={closeCart} aria-label="Close cart">
            &times;
          </button>
        </div>

        <div className="cart-items">
          {lines.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is currently empty.</p>
              <Link
                href="/collections"
                onClick={closeCart}
                className="mt-4 inline-flex text-sm font-semibold text-primary"
              >
                Explore collections
              </Link>
            </div>
          ) : (
            lines.map(({ node: item }) => {
              const product = item.merchandise.product;
              const image = product.featuredImage;

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : null}
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{product.title}</h3>
                    <p className="cart-item-price" style={{ marginBottom: '0.25rem' }}>
                      {item.merchandise.price.amount} {item.merchandise.price.currencyCode}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        Qty: {item.quantity}
                        {item.merchandise.sku ? ` | SKU ${item.merchandise.sku}` : ''}
                      </p>
                      <button
                        className="text-xs font-semibold text-primary"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Subtotal</span>
            <span>
              {totalAmount.toFixed(2)} {currencyCode}
            </span>
          </div>
          <div className="space-y-3">
            <Link
              href="/cart"
              onClick={closeCart}
              className="button-primary cart-checkout-btn"
              style={{ display: 'flex' }}
            >
              View Cart
            </Link>
            <Link
              href={lines.length > 0 ? '/checkout' : '/collections'}
              onClick={closeCart}
              className="button-secondary cart-checkout-btn"
              style={{ display: 'flex' }}
            >
              {lines.length > 0 ? 'Checkout' : 'Continue Shopping'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
