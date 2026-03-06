import { getProducts } from '../../../utils/shopify';
import ProductCard from '../../../components/stitch/ProductCard';

export const revalidate = 60;

// Currently re-using getProducts since a specific getCollection query wasn't strictly requested,
// but simulating a collection page pattern.
export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const { handle } = resolvedParams;
  
  // In a real app we would fetch products by collection handle here.
  const products = await getProducts(20); 

  return (
    <div className="container">
      <h1 className="section-title" style={{ textTransform: 'capitalize' }}>
        {handle.replace('-', ' ')} Collection
      </h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
