import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { OrderHistory } from '../../../components/account/AccountDashboard';

export const metadata = buildMetadata({
  title: 'Order History',
  description: 'Review Shopify-synced order history, line items, and order status links from your Silvan customer account.',
  path: '/account/orders',
});

export default function AccountOrdersPage() {
  return (
    <StorefrontLayout>
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">Order History</h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
          These orders are loaded from the Shopify customer account associated with your active session.
        </p>
      </section>

      <section className="mt-10">
        <OrderHistory />
      </section>
    </StorefrontLayout>
  );
}
