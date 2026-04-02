'use client';

import ProductExplorer from './ProductExplorer';

export default function CollectionClient({ products = [], collectionTitle = '', collectionHandle = '' }) {
  return (
    <ProductExplorer
      products={products}
      explorerKey={`collection-${collectionHandle || collectionTitle || 'default'}`}
      title={collectionTitle ? `${collectionTitle} Collection` : 'Collection'}
      description="Explore Shopify products with dynamic filters, infinite scroll, and synchronized collection data."
      emptyTitle="This collection is currently empty"
      emptyDescription="Shopify does not currently return any products that match this collection view."
      showCollectionSwitch={false}
    />
  );
}
