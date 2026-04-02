import Link from 'next/link';
import { siteConfig } from '../../lib/site';
import { getStorefrontDirectories } from '../../lib/storefrontData';
import { getMenu } from '../../utils/shopify';

function fallbackFooterMenu() {
  return [
    { title: 'Search', path: '/search' },
    { title: 'Collections', path: '/collections' },
    { title: 'Contact', path: '/contact' },
  ];
}

export default async function Footer() {
  const [footerMenu, storefrontDirectories] = await Promise.all([
    getMenu('footer'),
    getStorefrontDirectories(),
  ]);
  const menuItems = footerMenu?.items?.length ? footerMenu.items : fallbackFooterMenu();
  const featuredBrands = storefrontDirectories.brands.slice(0, 5);
  const featuredSpaces = storefrontDirectories.spaces.slice(0, 5);

  return (
    <footer className="mt-8 border-t border-gray-200/80" data-test="footer">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="font-display text-2xl font-semibold text-primary">
              {siteConfig.name}
            </Link>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Crafted furniture, synchronized directly from Shopify product, collection, and customer data.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Navigation</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/brand" className="transition-colors hover:text-primary">Brand</Link>
              <Link href="/space" className="transition-colors hover:text-primary">Shop by Space</Link>
              <Link href="/shop" className="transition-colors hover:text-primary">Shop Page</Link>
              {menuItems.map((item) => (
                <Link key={`${item.title}-${item.path}`} href={item.path || '#'} className="transition-colors hover:text-primary">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Brands</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              {featuredBrands.map((brand) => (
                <Link key={brand.slug || brand.href} href={brand.href} className="transition-colors hover:text-primary">
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Spaces</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              {featuredSpaces.map((space) => (
                <Link key={space.slug || space.href} href={space.href} className="transition-colors hover:text-primary">
                  {space.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Support</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/shipping" className="transition-colors hover:text-primary">Shipping Policy</Link>
              <Link href="/returns" className="transition-colors hover:text-primary">Returns & Refunds</Link>
              <Link href="/faq" className="transition-colors hover:text-primary">FAQ</Link>
              <Link href="/privacy" className="transition-colors hover:text-primary">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-primary">Terms</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200/80 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>{new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Storefront content is managed from Shopify admin.</p>
        </div>
      </div>
    </footer>
  );
}
