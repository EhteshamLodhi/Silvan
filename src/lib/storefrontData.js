import {
  BRAND_DIRECTORY,
  SPACE_DIRECTORY,
  buildBrandDirectory,
  buildSpaceDirectory,
  formatLabelFromSlug,
  hydrateCollectionScenes,
  matchesBrandSlug,
  matchesSpaceSlug,
  mergeCollectionProducts,
} from './storefrontDiscovery';
import { getAllCollections, getCollectionByHandle, getAllProducts } from '../utils/shopify';

async function getDetailedCollections(collections = [], productLimit = 50) {
  const detailedCollections = await Promise.all(
    collections.map((collection) => getCollectionByHandle(collection.handle, productLimit)),
  );

  return detailedCollections.filter(Boolean);
}

function buildDynamicDescription(collections, fallbackLabel) {
  const descriptions = [...new Set(collections.map((collection) => collection.description).filter(Boolean))];

  if (descriptions.length) {
    return descriptions[0];
  }

  return `Explore ${fallbackLabel} collections, products, and scene-driven discovery powered directly from Shopify.`;
}

export async function getBrandPageData(brandSlug) {
  const collections = await getAllCollections(100);
  const brand = BRAND_DIRECTORY.find((entry) => entry.slug === brandSlug) || {
    slug: brandSlug,
    label: formatLabelFromSlug(brandSlug),
    href: `/brand/${brandSlug}`,
  };
  const matchingCollections = collections.filter((collection) => matchesBrandSlug(collection, brandSlug));
  const detailedCollections = await getDetailedCollections(matchingCollections);
  const products = mergeCollectionProducts(detailedCollections);
  const scenes = hydrateCollectionScenes(detailedCollections);

  return {
    brand,
    collections: matchingCollections,
    detailedCollections,
    products,
    scenes,
    heroImage:
      scenes[0]?.image ||
      matchingCollections.find((collection) => collection.image?.url)?.image?.url ||
      null,
    description: buildDynamicDescription(matchingCollections, brand.label),
  };
}

export async function getSpacePageData(spaceSlug) {
  const collections = await getAllCollections(100);
  const space = SPACE_DIRECTORY.find((entry) => entry.slug === spaceSlug) || {
    slug: spaceSlug,
    label: formatLabelFromSlug(spaceSlug),
    href: `/space/${spaceSlug}`,
  };
  const matchingCollections = collections.filter((collection) => matchesSpaceSlug(collection, spaceSlug));
  const detailedCollections = await getDetailedCollections(matchingCollections);
  const products = mergeCollectionProducts(detailedCollections);
  const scenes = hydrateCollectionScenes(detailedCollections);

  return {
    space,
    collections: matchingCollections,
    detailedCollections,
    products,
    scenes,
    heroImage:
      scenes[0]?.image ||
      matchingCollections.find((collection) => collection.image?.url)?.image?.url ||
      null,
    description: buildDynamicDescription(matchingCollections, space.label),
  };
}

export async function getStorefrontDirectories() {
  try {
    const collections = await getAllCollections(100);

    return {
      collections,
      brands: buildBrandDirectory(collections),
      spaces: buildSpaceDirectory(collections),
    };
  } catch {
    return {
      collections: [],
      brands: BRAND_DIRECTORY,
      spaces: SPACE_DIRECTORY,
    };
  }
}

export async function getShopPageData() {
  try {
    const collections = await getAllCollections(100);
    const detailedCollections = await getDetailedCollections(collections);
    const products = mergeCollectionProducts(detailedCollections);

    return {
      collections,
      detailedCollections,
      products,
    };
  } catch {
    return {
      collections: [],
      detailedCollections: [],
      products: [],
    };
  }
}

export async function getHomepageDiscoveryData() {
  try {
    const { collections, brands, spaces } = await getStorefrontDirectories();
    const sceneCollections = collections.filter(
      (collection) =>
        collection.metafields?.some(
          (field) => field?.key === 'scene_products' && field?.value,
        ),
    );
    const detailedSceneCollections = await getDetailedCollections(sceneCollections.slice(0, 4), 24);
    const scenes = hydrateCollectionScenes(detailedSceneCollections);
    const featuredProducts = await getAllProducts(6);

    return {
      brands,
      spaces,
      scenes,
      featuredProducts,
    };
  } catch {
    return {
      brands: BRAND_DIRECTORY,
      spaces: SPACE_DIRECTORY,
      scenes: [],
      featuredProducts: [],
    };
  }
}
