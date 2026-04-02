'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cart } = useCart();
  const checkoutUrl = cart?.checkoutUrl;

  useEffect(() => {
    if (checkoutUrl) {
      window.location.assign(checkoutUrl);
    }
  }, [checkoutUrl]);

  return (
    <StorefrontLayout>
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white/70 p-8 text-center shadow-sm shadow-black/5 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Checkout</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary">Redirecting to secure checkout</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
          We are sending you to Shopify&apos;s secure checkout to complete your purchase.
        </p>

        {checkoutUrl ? (
          <a href={checkoutUrl} className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
            Continue to Checkout
          </a>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">There is no active checkout session yet. Add an item to your cart first.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/cart" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
                Return to Cart
              </Link>
              <Link href="/collections" className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
                Browse Collections
              </Link>
            </div>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
}
