import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { LoginForm } from '../../../components/account/AccountAuthForms';

export const metadata = buildMetadata({
  title: 'Account Login',
  description: 'Sign in with your Shopify customer account to access saved profile data and order history.',
  path: '/account/login',
});

export default function AccountLoginPage() {
  return (
    <StorefrontLayout>
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-sm shadow-black/5 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary">Log In</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
          Sign in using your Shopify customer account. Sessions persist through secure cookies so your account data stays available across the storefront.
        </p>
        <LoginForm />
      </section>
    </StorefrontLayout>
  );
}
