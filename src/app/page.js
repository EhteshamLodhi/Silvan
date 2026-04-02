import { getHomepageDiscoveryData } from '../lib/storefrontData';
import Header from '../components/stitch/Header';
import Hero from '../components/stitch/Hero';
import ShopByBrand from '../components/stitch/ShopByBrand';
import BespokeService from '../components/stitch/BespokeService';
import FeaturedProducts from '../components/stitch/FeaturedProducts';
import Footer from '../components/stitch/Footer';

export const revalidate = 60;

export default async function Home() {
  let homepageData = {
    brands: [],
    spaces: [],
    scenes: [],
    featuredProducts: [],
  };

  try {
    homepageData = await getHomepageDiscoveryData();
  } catch {
    homepageData = {
      brands: [],
      spaces: [],
      scenes: [],
      featuredProducts: [],
    };
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6 mb-6 lg:h-[680px]">
          <Hero
            scenes={homepageData.scenes}
            spaces={homepageData.spaces}
            featuredProducts={homepageData.featuredProducts}
          />
          <div className="w-full lg:w-[30%] flex flex-col gap-6 h-full">
            <ShopByBrand brands={homepageData.brands} />
            <BespokeService />
          </div>
        </div>

        <FeaturedProducts products={homepageData.featuredProducts} />
      </main>
      <Footer />
    </div>
  );
}
