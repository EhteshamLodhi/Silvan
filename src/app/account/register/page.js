import StorefrontLayout from '../../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../../lib/site';
import { RegisterForm } from '../../../components/account/AccountAuthForms';

export const metadata = buildMetadata({
  title: 'Create Account',
  description: 'Create a Shopify customer account for faster checkout, saved addresses, and order visibility.',
  path: '/account/register',
});

export default function AccountRegisterPage() {
  return (
    <StorefrontLayout>
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-sm shadow-black/5 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">Account</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary">Create Account</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
          New customers can create an account directly against Shopify so profile data and future order history stay synchronized automatically.
        </p>
        <RegisterForm />
      </section>
    </StorefrontLayout>
  );
}
