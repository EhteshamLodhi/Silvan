import { absoluteUrl } from '../lib/site';
import { BRAND_DIRECTORY, SPACE_DIRECTORY } from '../lib/storefrontDiscovery';
import { getAllCollections, getAllProducts } from '../utils/shopify';

export default async function sitemap() {
  const staticRoutes = [
    '/',
    '/brand',
    '/space',
    '/shop',
    '/collections',
    '/about',
    '/contact',
    '/sustainability',
    '/shipping',
    '/returns',
    '/faq',
    '/privacy',
    '/terms',
    '/cookies',
    '/search',
    '/cart',
    '/account',
    '/account/login',
    '/account/register',
    '/account/orders',
  ];

  const entries = staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
    }));

  try {
    const [collections, products] = await Promise.all([getAllCollections(100), getAllProducts(150)]);

    return [
      ...entries,
      ...BRAND_DIRECTORY.map((brand) => ({
        url: absoluteUrl(brand.href),
        lastModified: new Date(),
      })),
      ...SPACE_DIRECTORY.map((space) => ({
        url: absoluteUrl(space.href),
        lastModified: new Date(),
      })),
      ...collections
        .filter((collection) => collection.handle)
        .map((collection) => ({
          url: absoluteUrl(`/collections/${collection.handle}`),
          lastModified: new Date(),
        })),
      ...collections
        .filter((collection) => collection.handle)
        .map((collection) => ({
          url: absoluteUrl(`/collection/${collection.handle}`),
          lastModified: new Date(),
        })),
      ...products
        .filter((product) => product.handle)
        .map((product) => ({
          url: absoluteUrl(`/products/${product.handle}`),
          lastModified: new Date(),
        })),
      ...products
        .filter((product) => product.handle)
        .map((product) => ({
          url: absoluteUrl(`/product/${product.handle}`),
          lastModified: new Date(),
        })),
    ];
  } catch {
    return entries;
  }
}
