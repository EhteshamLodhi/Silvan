import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { AccountDashboard } from '../../components/account/AccountDashboard';

export const metadata = buildMetadata({
  title: 'Account',
  description: 'Manage your Shopify customer profile, addresses, metafields, and recent orders from the Silvan storefront.',
  path: '/account',
});

export default function AccountPage() {
  return (
    <StorefrontLayout>
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">Your account</h1>
        <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
          Profile data, saved addresses, customer metafields, and order history are synced directly from Shopify customer records.
        </p>
      </section>

      <section className="mt-10">
        <AccountDashboard />
      </section>
    </StorefrontLayout>
  );
}
