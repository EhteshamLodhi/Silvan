'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { useCart } from '../../context/CartContext';

function QuantityControl({ lineId, quantity, onChange, disabled }) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
      <button
        className="px-3 py-2 text-sm text-gray-600 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onChange(lineId, quantity - 1)}
        disabled={disabled}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="min-w-10 px-2 text-center text-sm font-medium text-gray-800">{quantity}</span>
      <button
        className="px-3 py-2 text-sm text-gray-600 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onChange(lineId, quantity + 1)}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default function CartPage() {
  const { cart, isUpdating, updateLineQuantity, removeFromCart, applyDiscountCode, cartNotice } =
    useCart();
  const [discountCode, setDiscountCode] = useState('');

  const lines = cart?.lines?.edges || [];
  const totalAmount = Number(cart?.cost?.totalAmount?.amount || 0);
  const subtotalAmount = Number(cart?.cost?.subtotalAmount?.amount || 0);
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || 'USD';

  return (
    <StorefrontLayout>
      <section className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Cart</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">
            Your Shopping Cart
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-700">
            Review your Shopify cart, adjust quantities, and continue to checkout when ready.
          </p>

          {lines.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-black/5 bg-white/60 p-8 text-center shadow-sm shadow-black/5">
              <h2 className="font-display text-3xl font-semibold text-primary">Your cart is empty</h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 md:text-base">
                Add a few pieces to your cart and return here when you are ready to check out.
              </p>
              <Link
                href="/collections"
                className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-10 space-y-5">
              {lines.map(({ node: item }) => {
                const product = item.merchandise.product;
                const image = product.featuredImage;

                return (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-[1.75rem] border border-black/5 bg-white/70 p-5 shadow-sm shadow-black/5 md:grid-cols-[140px_1fr]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText || product.title}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/product/${product.handle}`}
                              className="font-display text-2xl font-semibold text-primary transition-colors hover:text-secondary"
                            >
                              {product.title}
                            </Link>
                            <p className="mt-2 text-sm text-gray-500">
                              {item.merchandise.title}
                              {item.merchandise.sku ? ` | SKU ${item.merchandise.sku}` : ''}
                            </p>
                          </div>
                          <p className="text-base font-semibold text-primary">
                            {Number(item.merchandise.price.amount).toFixed(2)}{' '}
                            {item.merchandise.price.currencyCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <QuantityControl
                          lineId={item.id}
                          quantity={item.quantity}
                          onChange={updateLineQuantity}
                          disabled={isUpdating}
                        />
                        <button
                          className="text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isUpdating}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5">
          <h2 className="font-display text-2xl font-semibold text-primary">Order Summary</h2>
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <span>Items</span>
            <span>{lines.reduce((sum, edge) => sum + edge.node.quantity, 0)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>
              {subtotalAmount.toFixed(2)} {currencyCode}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-base font-semibold text-primary">
            <span>Total</span>
            <span>
              {totalAmount.toFixed(2)} {currencyCode}
            </span>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              applyDiscountCode(discountCode.trim());
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="text"
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              placeholder="Discount code"
              className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
            />
            <button className="w-full rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
              Apply Discount
            </button>
            {cartNotice ? <p className="text-sm text-gray-600">{cartNotice}</p> : null}
          </form>

          <div className="mt-6 space-y-3">
            <Link
              href={lines.length > 0 ? '/checkout' : '/collections'}
              className={`flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                lines.length > 0
                  ? 'bg-primary text-white hover:bg-secondary'
                  : 'border border-primary/15 bg-white text-primary hover:border-primary'
              }`}
            >
              {lines.length > 0 ? 'Proceed to Checkout' : 'Browse Collections'}
            </Link>
            <Link
              href="/search"
              className="flex w-full items-center justify-center rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary"
            >
              Search More Products
            </Link>
          </div>
        </aside>
      </section>
    </StorefrontLayout>
  );
}
