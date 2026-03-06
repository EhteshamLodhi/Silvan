import { getProducts } from '../utils/shopify';
import Header from '../components/stitch/Header';
import Hero from '../components/stitch/Hero';
import ShopByBrand from '../components/stitch/ShopByBrand';
import BespokeService from '../components/stitch/BespokeService';
import FilterBar from '../components/stitch/FilterBar';
import FeaturedProducts from '../components/stitch/FeaturedProducts';
import Showrooms from '../components/stitch/Showrooms';
import Footer from '../components/stitch/Footer';

export const revalidate = 60; // ISR - revalidate every 60 seconds

export default async function Home() {
  // MAP: Fetch 3 featured products from Shopify to map into the component
  const products = await getProducts(3);

  return (
    <div className="min-h-screen text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <Header cartCount={0} />
        
        <div className="flex flex-col lg:flex-row gap-6 mb-6 h-auto lg:h-[700px]">
          <Hero />
          
          <div className="w-full lg:w-[30%] flex flex-col gap-6 h-full">
            <ShopByBrand />
            <BespokeService />
          </div>
        </div>
        
        <FilterBar />
        
        <FeaturedProducts products={products} />
        
        <Showrooms />
        
        <Footer />
      </div>
    </div>
  );
}
