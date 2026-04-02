export const BRAND_DIRECTORY = [
  { slug: 'urbanest', label: 'Urbanest', href: '/brand/urbanest' },
  { slug: 'spacio', label: 'Spacio', href: '/brand/spacio' },
  { slug: 'kiddora', label: 'Kiddora', href: '/brand/kiddora' },
  { slug: 'roygrain', label: 'Roygrain', href: '/brand/roygrain' },
  { slug: 'outaura', label: 'Outaura', href: '/brand/outaura' },
];

export const SPACE_DIRECTORY = [
  { slug: 'living-room', label: 'Living Room', href: '/space/living-room' },
  { slug: 'bedroom', label: 'Bedroom', href: '/space/bedroom' },
  { slug: 'workspace', label: 'Workspace', href: '/space/workspace' },
  { slug: 'kids-room', label: 'Kids Room', href: '/space/kids-room' },
  { slug: 'balcony', label: 'Balcony', href: '/space/balcony' },
  { slug: 'dining-room', label: 'Dining Room', href: '/space/dining-room' },
  { slug: 'outdoor-space', label: 'Outdoor Space', href: '/space/outdoor-space' },
];

export function normalizeSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatLabelFromSlug(slug = '') {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function getMetafieldValue(entity, key) {
  return (entity?.metafields || []).find((field) => field?.key === key)?.value || null;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function splitMetafieldValues(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((entry) => normalizeSlug(entry));
    }
    if (typeof parsed === 'string') {
      return [normalizeSlug(parsed)];
    }
  } catch {
    return unique(
      String(value)
        .split(/[,|]/)
        .map((entry) => normalizeSlug(entry)),
    );
  }

  return [];
}

export function getCollectionBrandSlug(collection) {
  return normalizeSlug(getMetafieldValue(collection, 'brand'));
}

export function getCollectionSpaceSlugs(collection) {
  return unique([
    ...splitMetafieldValues(getMetafieldValue(collection, 'usage_space')),
    ...splitMetafieldValues(getMetafieldValue(collection, 'room_category')),
  ]);
}

export function matchesBrandSlug(collection, brandSlug) {
  return getCollectionBrandSlug(collection) === normalizeSlug(brandSlug);
}

export function matchesSpaceSlug(collection, spaceSlug) {
  const normalized = normalizeSlug(spaceSlug);
  const spaces = getCollectionSpaceSlugs(collection);

  if (spaces.includes(normalized)) {
    return true;
  }

  const fallbackText = `${collection?.handle || ''} ${collection?.title || ''}`.toLowerCase();
  return normalized
    .split('-')
    .filter(Boolean)
    .every((token) => fallbackText.includes(token));
}

function normalizeHotspot(rawHotspot, fallbackHandle, index) {
  if (!rawHotspot && !fallbackHandle) {
    return null;
  }

  if (Array.isArray(rawHotspot)) {
    const [x, y, handle = fallbackHandle] = rawHotspot;
    if (typeof x !== 'number' || typeof y !== 'number' || !handle) {
      return null;
    }

    return {
      id: `hotspot-${index}`,
      handle,
      x,
      y,
      label: null,
    };
  }

  if (typeof rawHotspot === 'object') {
    const x = Number(rawHotspot.x ?? rawHotspot.left ?? rawHotspot.horizontal);
    const y = Number(rawHotspot.y ?? rawHotspot.top ?? rawHotspot.vertical);
    const handle = rawHotspot.handle || rawHotspot.product_handle || fallbackHandle;

    if (Number.isNaN(x) || Number.isNaN(y) || !handle) {
      return null;
    }

    return {
      id: rawHotspot.id || `hotspot-${index}`,
      handle,
      x,
      y,
      label: rawHotspot.label || rawHotspot.title || null,
    };
  }

  if (fallbackHandle) {
    return {
      id: `hotspot-${index}`,
      handle: fallbackHandle,
      x: 20 + (index % 3) * 25,
      y: 35 + Math.floor(index / 3) * 18,
      label: null,
    };
  }

  return null;
}

export function parseSceneProductsMetafield(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    const scenes = Array.isArray(parsed) ? parsed : [parsed];

    return scenes
      .map((scene, index) => {
        const productHandles = unique(
          [
            ...(scene?.product_handles || []),
            ...(scene?.productHandles || []),
            ...((scene?.products || []).map((product) =>
              typeof product === 'string' ? product : product?.handle,
            )),
          ].map((handle) => normalizeSlug(handle)),
        );

        const rawHotspots =
          scene?.hotspot_coordinates ||
          scene?.hotspotCoordinates ||
          scene?.hotspots ||
          [];

        const hotspotCoordinates = (Array.isArray(rawHotspots) ? rawHotspots : [])
          .map((hotspot, hotspotIndex) =>
            normalizeHotspot(hotspot, productHandles[hotspotIndex], hotspotIndex),
          )
          .filter(Boolean);

        if (!scene?.scene_image && !scene?.sceneImage && !scene?.image && !productHandles.length) {
          return null;
        }

        return {
          id: scene?.id || `scene-${index}`,
          title: scene?.title || scene?.name || null,
          description: scene?.description || scene?.subtitle || null,
          image: scene?.scene_image || scene?.sceneImage || scene?.image || null,
          productHandles,
          hotspotCoordinates,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getCollectionProducts(collection) {
  if (Array.isArray(collection?.products)) {
    return collection.products;
  }

  if (collection?.products?.edges) {
    return collection.products.edges.map((edge) => edge.node);
  }

  return [];
}

export function mergeCollectionProducts(collections = []) {
  const productMap = new Map();

  collections.forEach((collection) => {
    const collectionProducts = getCollectionProducts(collection);
    const collectionSpaces = getCollectionSpaceSlugs(collection);

    collectionProducts.forEach((product) => {
      const existing = productMap.get(product.handle);

      if (existing) {
        existing.collectionHandles = unique([...existing.collectionHandles, collection.handle]);
        existing.collectionTitles = unique([...existing.collectionTitles, collection.title]);
        existing.roomCategories = unique([...existing.roomCategories, ...collectionSpaces]);
        return;
      }

      productMap.set(product.handle, {
        ...product,
        collectionHandles: unique([collection.handle]),
        collectionTitles: unique([collection.title]),
        roomCategories: unique(collectionSpaces),
      });
    });
  });

  return [...productMap.values()];
}

export function hydrateCollectionScenes(collections = []) {
  const products = mergeCollectionProducts(collections);
  const productMap = new Map(products.map((product) => [normalizeSlug(product.handle), product]));

  return collections.flatMap((collection, collectionIndex) => {
    const parsedScenes = parseSceneProductsMetafield(getMetafieldValue(collection, 'scene_products'));
    const collectionSceneImage =
      getMetafieldValue(collection, 'scene_image') || collection?.image?.url || null;

    return parsedScenes
      .map((scene, sceneIndex) => {
        const hotspots = scene.hotspotCoordinates
          .map((hotspot) => ({
            ...hotspot,
            product: productMap.get(normalizeSlug(hotspot.handle)) || null,
          }))
          .filter((hotspot) => hotspot.product);

        if (!scene.image && !collectionSceneImage) {
          return null;
        }

        return {
          id: `${collection.handle}-scene-${sceneIndex}-${collectionIndex}`,
          title: scene.title || collection.title,
          description: scene.description || collection.description || null,
          image: scene.image || collectionSceneImage,
          collectionHandle: collection.handle,
          collectionTitle: collection.title,
          hotspots,
        };
      })
      .filter((scene) => scene && scene.hotspots.length);
  });
}

export function buildBrandDirectory(collections = []) {
  return BRAND_DIRECTORY.map((brand) => {
    const brandCollections = collections.filter((collection) => matchesBrandSlug(collection, brand.slug));

    return {
      ...brand,
      collectionCount: brandCollections.length,
    };
  });
}

export function buildSpaceDirectory(collections = []) {
  return SPACE_DIRECTORY.map((space) => {
    const spaceCollections = collections.filter((collection) => matchesSpaceSlug(collection, space.slug));
    const sceneCount = spaceCollections.reduce(
      (sum, collection) =>
        sum + parseSceneProductsMetafield(getMetafieldValue(collection, 'scene_products')).length,
      0,
    );

    return {
      ...space,
      collectionCount: spaceCollections.length,
      sceneCount,
    };
  });
}
