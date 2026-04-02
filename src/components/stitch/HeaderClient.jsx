'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';

function fallbackMenuItems() {
  return [
    { title: 'Contact', path: '/contact' },
    { title: 'About', path: '/about' },
  ];
}

function sanitizeSupplementalItems(items = []) {
  const hiddenPaths = new Set(['/', '/collections', '/shop', '/brand', '/space']);
  return items.filter((item) => item?.path && !hiddenPaths.has(item.path));
}

export default function HeaderClient({ menu, collections = [], brands = [], spaces = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState({ products: [], collections: [] });
  const { cart, openCart } = useCart();
  const { customer } = useCustomer();

  const menuItems = sanitizeSupplementalItems(menu?.items?.length ? menu.items : fallbackMenuItems());
  const featuredCollections = collections.slice(0, 6);
  const cartItemCount =
    cart?.totalQuantity || (cart?.lines?.edges || []).reduce((acc, edge) => acc + edge.node.quantity, 0);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions({ products: [], collections: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, { cache: 'no-store' });
        const json = await response.json();
        setSuggestions(json);
      } catch (error) {
        console.error('Unable to load search suggestions:', error);
      }
    }, 180);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const accountLabel = useMemo(() => {
    if (!customer) return 'Account';
    return customer.firstName || customer.displayName || 'My Account';
  }, [customer]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/60 bg-[#F5F0E6]/95 backdrop-blur-sm" data-test="header">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="font-display whitespace-nowrap text-xl font-semibold text-primary" data-test="header-logo">
          Silvan & Co.
        </Link>

        <div className="hidden items-center space-x-7 text-sm font-medium text-gray-700 md:flex">
          <div className="group relative py-2">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
          </div>

          <div className="group relative py-2">
            <button className="flex items-center space-x-1 transition-colors hover:text-primary">
              <span>Brand</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:rotate-180">expand_more</span>
            </button>

            <div className="absolute left-0 top-full invisible w-64 translate-y-2 rounded-xl border border-gray-100 bg-[#F5F0E6] py-3 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link href="/brand" className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                All Brands
              </Link>
              {brands.map((brand) => (
                <Link key={brand.slug || brand.href} href={brand.href} className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative py-2">
            <button className="flex items-center space-x-1 transition-colors hover:text-primary">
              <span>Shop by Space</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:rotate-180">expand_more</span>
            </button>

            <div className="absolute left-0 top-full invisible w-64 translate-y-2 rounded-xl border border-gray-100 bg-[#F5F0E6] py-3 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link href="/space" className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                All Spaces
              </Link>
              {spaces.map((space) => (
                <Link key={space.slug || space.href} href={space.href} className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                  {space.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="group relative py-2">
            <button className="flex items-center space-x-1 transition-colors hover:text-primary">
              <span>Shop Page</span>
              <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:rotate-180">expand_more</span>
            </button>

            <div className="absolute left-0 top-full invisible w-72 translate-y-2 rounded-xl border border-gray-100 bg-[#F5F0E6] py-3 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link href="/shop" className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                Global Shop Explorer
              </Link>
              {featuredCollections.map((collection) => (
                <Link key={collection.id || collection.handle} href={`/collection/${collection.handle}`} className="block px-5 py-2 transition-colors hover:bg-white/50 hover:text-primary">
                  {collection.title}
                </Link>
              ))}
            </div>
          </div>

          {menuItems.map((item) => (
            <Link key={`${item.title}-${item.path}`} href={item.path || '#'} className="transition-colors hover:text-primary">
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => setSearchOpen((current) => !current)} className="p-1.5 text-gray-600 transition-colors hover:text-primary" aria-label="Search">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            onClick={openCart}
            className="relative flex items-center space-x-1 rounded-full border border-gray-300 px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
            data-test="cart-btn"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            {cartItemCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-accent text-[10px] font-bold leading-none text-white">
                {cartItemCount}
              </span>
            ) : null}
          </button>
          <Link href="/account" className="rounded-full bg-primary px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-secondary" data-test="login-btn">
            {accountLabel}
          </Link>

          <button className="p-1 text-gray-600 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {searchOpen ? (
        <div className="border-t border-gray-100 bg-[#F5F0E6] px-4 py-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <form action="/search" className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                name="q"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products or collections"
                className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-primary"
              />
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary">
                Search
              </button>
            </form>

            {searchTerm.trim() ? (
              <div className="mt-4 grid gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm shadow-black/5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Products</p>
                  <div className="mt-3 space-y-2">
                    {suggestions.products?.length ? suggestions.products.map((product) => (
                      <Link key={product.id} href={`/product/${product.handle}`} className="block rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-[#F7F1E8] hover:text-primary">
                        {product.title}
                      </Link>
                    )) : <p className="text-sm text-gray-500">No matching products yet.</p>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/60">Collections</p>
                  <div className="mt-3 space-y-2">
                    {suggestions.collections?.length ? suggestions.collections.map((collection) => (
                      <Link key={collection.id} href={`/collection/${collection.handle}`} className="block rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-[#F7F1E8] hover:text-primary">
                        {collection.title}
                      </Link>
                    )) : <p className="text-sm text-gray-500">No matching collections yet.</p>}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="animate-in slide-in-from-top border-t border-gray-100 bg-[#F5F0E6] px-6 pb-6 text-sm font-medium duration-300 md:hidden">
          <Link href="/" className="block py-1 text-gray-700 transition-colors hover:text-primary">Home</Link>
          <Link href="/brand" className="block py-1 text-gray-700 transition-colors hover:text-primary">Brand</Link>
          <Link href="/space" className="block py-1 text-gray-700 transition-colors hover:text-primary">Shop by Space</Link>
          <Link href="/shop" className="block py-1 text-gray-700 transition-colors hover:text-primary">Shop Page</Link>
          <div className="my-3 h-px w-full bg-gray-100" />
          <div className="mb-1 pt-1 text-xs font-bold uppercase tracking-widest text-gray-400">Brands</div>
          <div className="grid grid-cols-2 gap-2">
            {brands.map((brand) => (
              <Link key={brand.slug || brand.href} href={brand.href} className="rounded-lg bg-white/40 px-4 py-2 text-gray-700 transition-colors hover:text-primary">
                {brand.label}
              </Link>
            ))}
          </div>
          <div className="my-3 h-px w-full bg-gray-100" />
          <div className="mb-1 pt-1 text-xs font-bold uppercase tracking-widest text-gray-400">Spaces</div>
          <div className="grid grid-cols-2 gap-2">
            {spaces.map((space) => (
              <Link key={space.slug || space.href} href={space.href} className="rounded-lg bg-white/40 px-4 py-2 text-gray-700 transition-colors hover:text-primary">
                {space.label}
              </Link>
            ))}
          </div>
          <div className="my-3 h-px w-full bg-gray-100" />
          <div className="mb-1 pt-1 text-xs font-bold uppercase tracking-widest text-gray-400">Collections</div>
          <div className="grid grid-cols-2 gap-2">
            {featuredCollections.map((collection) => (
              <Link key={collection.id || collection.handle} href={`/collection/${collection.handle}`} className="rounded-lg bg-white/40 px-4 py-2 text-gray-700 transition-colors hover:text-primary">
                {collection.title}
              </Link>
            ))}
          </div>
          <div className="my-3 h-px w-full bg-gray-100" />
          {menuItems.map((item) => (
            <Link key={`${item.title}-${item.path}`} href={item.path || '#'} className="block py-1 text-gray-700 transition-colors hover:text-primary">
              {item.title}
            </Link>
          ))}
          <Link href="/search" className="block py-1 text-gray-700 transition-colors hover:text-primary">Search</Link>
          <Link href="/cart" className="block py-1 text-gray-700 transition-colors hover:text-primary">Cart</Link>
          <Link href="/account" className="block py-1 text-gray-700 transition-colors hover:text-primary">{accountLabel}</Link>
        </div>
      ) : null}
    </header>
  );
}
