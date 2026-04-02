import Link from 'next/link';
import StorefrontLayout from '../components/stitch/StorefrontLayout';

export default function NotFound() {
  return (
    <StorefrontLayout>
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-white/70 p-10 text-center shadow-sm shadow-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/60">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-primary md:text-5xl">This page wandered off</h1>
        <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
          The link may be outdated, the product may have moved, or the page may no longer exist. Use one of the routes below to get back on track.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
            Back Home
          </Link>
          <Link href="/collections" className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
            Browse Collections
          </Link>
          <Link href="/search" className="rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary">
            Search Products
          </Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}
