'use client';

import Link from 'next/link';
import { useCustomer } from '../../context/CustomerContext';

function formatMoney(amount, currencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function metafieldLabel(key = '') {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AccountDashboard() {
  const { customer, isLoading, logout } = useCustomer();

  if (isLoading) {
    return <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-sm text-gray-600 shadow-sm shadow-black/5">Loading your account...</div>;
  }

  if (!customer) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 shadow-sm shadow-black/5">
        <h2 className="font-display text-3xl font-semibold text-primary">You are not signed in</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
          Sign in to view profile details, saved addresses, and recent orders synced from Shopify.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/account/login" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
            Sign In
          </Link>
          <Link href="/account/register" className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-black/5 bg-white/60 p-8 shadow-sm shadow-black/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Customer</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-primary">
              {customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">{customer.email}</p>
            {customer.phone ? <p className="text-sm leading-7 text-gray-600">{customer.phone}</p> : null}
          </div>
          <button onClick={logout} className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
            Log Out
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5">
          <h3 className="font-display text-2xl font-semibold text-primary">Default Address</h3>
          {customer.defaultAddress ? (
            <div className="mt-4 space-y-1 text-sm leading-7 text-gray-600">
              {customer.defaultAddress.formatted.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-600">No default address saved yet.</p>
          )}
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5">
          <h3 className="font-display text-2xl font-semibold text-primary">Customer Metafields</h3>
          <div className="mt-4 space-y-3">
            {(customer.metafields || []).filter(Boolean).length ? (
              customer.metafields.filter(Boolean).map((field) => (
                <div key={`${field.namespace}-${field.key}`} className="rounded-2xl bg-[#F7F1E8] px-4 py-3 text-sm">
                  <p className="font-semibold text-primary">{field.key.replace(/_/g, ' ')}</p>
                  <p className="mt-1 text-gray-600">{field.value}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No customer metafields are currently exposed through the Storefront API.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold text-primary">Recent Orders</h3>
          <Link href="/account/orders" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {customer.orders?.edges?.length ? (
            customer.orders.edges.slice(0, 3).map(({ node }) => (
              <div key={node.id} className="rounded-2xl border border-black/5 bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{node.name}</p>
                    <p className="text-sm text-gray-500">{new Date(node.processedAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{formatMoney(node.totalPrice.amount, node.totalPrice.currencyCode)}</p>
                </div>
                {(node.metafields || []).filter(Boolean).length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {node.metafields.filter(Boolean).map((field) => (
                      <span key={`${node.id}-${field.namespace}-${field.key}`} className="rounded-full bg-[#F7F1E8] px-3 py-1 text-xs text-gray-600">
                        {metafieldLabel(field.key)}: {field.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export function OrderHistory() {
  const { customer, isLoading } = useCustomer();

  if (isLoading) {
    return <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-sm text-gray-600 shadow-sm shadow-black/5">Loading your orders...</div>;
  }

  if (!customer) {
    return (
      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 shadow-sm shadow-black/5">
        <p className="text-sm text-gray-600">Sign in to view orders synced from Shopify.</p>
        <Link href="/account/login" className="mt-4 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {customer.orders?.edges?.length ? (
        customer.orders.edges.map(({ node }) => (
          <article key={node.id} className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-primary">{node.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{new Date(node.processedAt).toLocaleString()}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Status: {node.fulfillmentStatus || 'Unfulfilled'}</p>
                <p>Payment: {node.financialStatus || 'Pending'}</p>
                <p className="mt-1 font-semibold text-gray-800">{formatMoney(node.totalPrice.amount, node.totalPrice.currencyCode)}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {node.lineItems?.edges?.map(({ node: lineItem }) => (
                <div key={`${node.id}-${lineItem.title}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{lineItem.title}</p>
                    <p className="text-gray-500">Qty {lineItem.quantity}</p>
                  </div>
                  {lineItem.variant?.title ? <p className="text-gray-500">{lineItem.variant.title}</p> : null}
                </div>
              ))}
            </div>

            {(node.metafields || []).filter(Boolean).length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {node.metafields.filter(Boolean).map((field) => (
                  <div key={`${node.id}-${field.namespace}-${field.key}`} className="rounded-2xl bg-white px-4 py-3 text-sm">
                    <p className="font-semibold text-primary">{metafieldLabel(field.key)}</p>
                    <p className="mt-1 text-gray-600">{field.value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {node.statusUrl ? (
              <a href={node.statusUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
                Open Order Status
              </a>
            ) : null}
          </article>
        ))
      ) : (
        <div className="rounded-[2rem] border border-black/5 bg-white/60 p-8 text-sm text-gray-600 shadow-sm shadow-black/5">
          No orders have been placed on this account yet.
        </div>
      )}
    </div>
  );
}
