import ProductExplorer from '../../components/stitch/ProductExplorer';
import StorefrontLayout from '../../components/stitch/StorefrontLayout';
import { buildMetadata } from '../../lib/site';
import { getShopPageData } from '../../lib/storefrontData';

export const metadata = buildMetadata({
  title: 'Shop Page',
  description: 'Global product explorer with Shopify collections, dynamic filters, and infinite scroll.',
  path: '/shop',
});

export const revalidate = 60;

export default async function ShopPage() {
  const data = await getShopPageData();
  const collectionLinks = data.collections.map((collection) => ({
    handle: collection.handle,
    title: collection.title,
  }));

  return (
    <StorefrontLayout>
      <ProductExplorer
        products={data.products}
        collections={collectionLinks}
        explorerKey="shop-page"
        title="Shop Page"
        description="A global Shopify product explorer with dynamic collection switching, custom metafield filters, and infinite-scroll browsing continuity."
        emptyTitle="No Shopify products are available"
        emptyDescription="The shop page will populate automatically when products and collections are available in Shopify."
      />
    </StorefrontLayout>
  );
}
