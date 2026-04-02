'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from './ProductCard';

const INITIAL_BATCH = 9;
const NEXT_BATCH = 6;
const FILTER_KEY_ORDER = [
  'material',
  'color',
  'size',
  'room_category',
  'dimension',
  'dimensions',
  'wood_type',
  'finish',
  'style',
  'usage_space',
];

function formatLabel(value = '') {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitValues(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
    if (typeof parsed === 'string') {
      return [parsed];
    }
  } catch {
    return String(value)
      .split(/[,|]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function getProductOptionValues(product, optionNames) {
  const matchingOptions = (product?.options || []).filter((option) =>
    optionNames.includes(option.name.toLowerCase()),
  );

  return [...new Set(matchingOptions.flatMap((option) => option.values || []).filter(Boolean))];
}

function getProductAttributeValues(product, key) {
  const matchingMetafields = (product?.metafields || []).filter((field) => field?.key === key);
  const values = matchingMetafields.flatMap((field) => splitValues(field?.value));

  if (values.length) {
    return [...new Set(values)];
  }

  if (key === 'color') {
    return getProductOptionValues(product, ['color', 'colour', 'finish']);
  }

  if (key === 'size') {
    return getProductOptionValues(product, ['size']);
  }

  if (key === 'room_category' || key === 'usage_space') {
    return product?.roomCategories || [];
  }

  return [];
}

function buildDynamicFilterFields(products) {
  const discoveredKeys = [
    ...new Set(
      products.flatMap((product) =>
        (product?.metafields || []).map((field) => field?.key).filter(Boolean),
      ),
    ),
  ];

  const orderedKeys = [
    ...FILTER_KEY_ORDER.filter(
      (key) =>
        discoveredKeys.includes(key) ||
        products.some((product) => getProductAttributeValues(product, key).length),
    ),
    ...discoveredKeys.filter((key) => !FILTER_KEY_ORDER.includes(key)),
  ];

  return orderedKeys
    .map((key) => ({
      key,
      label: formatLabel(key),
      values: [
        'All',
        ...new Set(
          products.flatMap((product) => getProductAttributeValues(product, key)).filter(Boolean),
        ),
      ],
    }))
    .filter((field) => field.values.length > 1);
}

function readStoredState(explorerKey) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`explorer:${explorerKey}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredState(explorerKey, payload) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(`explorer:${explorerKey}`, JSON.stringify(payload));
}

export default function ProductExplorer({
  products = [],
  collections = [],
  explorerKey = 'default',
  title = '',
  description = '',
  emptyTitle = 'No products to show',
  emptyDescription = 'There are no Shopify products available for this view yet.',
  showCollectionSwitch = true,
}) {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedMetafields, setSelectedMetafields] = useState({});
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const [maxPrice, setMaxPrice] = useState(null);
  const [hasRestoredState, setHasRestoredState] = useState(false);
  const sentinelRef = useRef(null);

  const maxDetectedPrice = useMemo(
    () =>
      Math.max(
        0,
        ...products.map((product) => Number(product?.priceRange?.minVariantPrice?.amount || 0)),
      ),
    [products],
  );

  const dynamicFilterFields = useMemo(() => buildDynamicFilterFields(products), [products]);
  const collectionOptions = useMemo(
    () => [{ handle: 'all', title: 'All Products' }, ...collections],
    [collections],
  );
  const vendors = useMemo(
    () => ['All', ...new Set(products.map((product) => product.vendor).filter(Boolean))],
    [products],
  );
  const types = useMemo(
    () => ['All', ...new Set(products.map((product) => product.productType).filter(Boolean))],
    [products],
  );
  const tags = useMemo(
    () => ['All', ...new Set(products.flatMap((product) => product.tags || []).filter(Boolean))],
    [products],
  );

  useEffect(() => {
    setMaxPrice((current) => current ?? (maxDetectedPrice || 5000));
  }, [maxDetectedPrice]);

  useEffect(() => {
    const stored = readStoredState(explorerKey);
    if (!stored) {
      setHasRestoredState(true);
      return;
    }

    setSelectedCollection(stored.selectedCollection || 'all');
    setSelectedVendor(stored.selectedVendor || 'All');
    setSelectedType(stored.selectedType || 'All');
    setSelectedTag(stored.selectedTag || 'All');
    setAvailabilityOnly(Boolean(stored.availabilityOnly));
    setSortBy(stored.sortBy || 'Featured');
    setSelectedMetafields(stored.selectedMetafields || {});
    setVisibleCount(stored.visibleCount || INITIAL_BATCH);
    if (typeof stored.maxPrice === 'number') {
      setMaxPrice(stored.maxPrice);
    }

    const savedScrollY = stored.scrollY;
    if (typeof savedScrollY === 'number') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollY, behavior: 'auto' });
      });
    }

    setHasRestoredState(true);
  }, [explorerKey]);

  useEffect(() => {
    if (!hasRestoredState || typeof maxPrice !== 'number') {
      return;
    }

    writeStoredState(explorerKey, {
      selectedCollection,
      selectedVendor,
      selectedType,
      selectedTag,
      availabilityOnly,
      sortBy,
      selectedMetafields,
      visibleCount,
      maxPrice,
      scrollY: typeof window === 'undefined' ? 0 : window.scrollY,
    });
  }, [
    availabilityOnly,
    explorerKey,
    hasRestoredState,
    maxPrice,
    selectedCollection,
    selectedMetafields,
    selectedTag,
    selectedType,
    selectedVendor,
    sortBy,
    visibleCount,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasRestoredState) {
      return;
    }

    const handleScroll = () => {
      const stored = readStoredState(explorerKey) || {};
      writeStoredState(explorerKey, { ...stored, scrollY: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [explorerKey, hasRestoredState]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCollection !== 'all') {
      list = list.filter((product) => (product.collectionHandles || []).includes(selectedCollection));
    }

    if (selectedVendor !== 'All') {
      list = list.filter((product) => product.vendor === selectedVendor);
    }

    if (selectedType !== 'All') {
      list = list.filter((product) => product.productType === selectedType);
    }

    if (selectedTag !== 'All') {
      list = list.filter((product) => (product.tags || []).includes(selectedTag));
    }

    if (availabilityOnly) {
      list = list.filter((product) => product.availableForSale);
    }

    if (typeof maxPrice === 'number') {
      list = list.filter(
        (product) => Number(product?.priceRange?.minVariantPrice?.amount || 0) <= maxPrice,
      );
    }

    Object.entries(selectedMetafields).forEach(([key, value]) => {
      if (!value || value === 'All') {
        return;
      }

      list = list.filter((product) => getProductAttributeValues(product, key).includes(value));
    });

    if (sortBy === 'Price: Low to High') {
      list.sort(
        (left, right) =>
          Number(left?.priceRange?.minVariantPrice?.amount || 0) -
          Number(right?.priceRange?.minVariantPrice?.amount || 0),
      );
    } else if (sortBy === 'Price: High to Low') {
      list.sort(
        (left, right) =>
          Number(right?.priceRange?.minVariantPrice?.amount || 0) -
          Number(left?.priceRange?.minVariantPrice?.amount || 0),
      );
    } else if (sortBy === 'Title') {
      list.sort((left, right) => left.title.localeCompare(right.title));
    }

    return list;
  }, [
    availabilityOnly,
    maxPrice,
    products,
    selectedCollection,
    selectedMetafields,
    selectedTag,
    selectedType,
    selectedVendor,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < filteredProducts.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMoreProducts) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + NEXT_BATCH, filteredProducts.length));
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredProducts.length, hasMoreProducts]);

  function resetFilters() {
    setSelectedCollection('all');
    setSelectedVendor('All');
    setSelectedType('All');
    setSelectedTag('All');
    setAvailabilityOnly(false);
    setSortBy('Featured');
    setSelectedMetafields({});
    setVisibleCount(INITIAL_BATCH);
    setMaxPrice(maxDetectedPrice || 5000);
  }

  function updateMetafieldFilter(key, value) {
    setSelectedMetafields((current) => ({ ...current, [key]: value }));
    setVisibleCount(INITIAL_BATCH);
  }

  const filters = (
    <div className="flex flex-col gap-6">
      {showCollectionSwitch && collections.length ? (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            Collection
          </h3>
          <select
            value={selectedCollection}
            onChange={(event) => {
              setSelectedCollection(event.target.value);
              setVisibleCount(INITIAL_BATCH);
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
          >
            {collectionOptions.map((collection) => (
              <option key={collection.handle} value={collection.handle}>
                {collection.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Vendor</h3>
        <select
          value={selectedVendor}
          onChange={(event) => {
            setSelectedVendor(event.target.value);
            setVisibleCount(INITIAL_BATCH);
          }}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
        >
          {vendors.map((vendor) => (
            <option key={vendor}>{vendor}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
          Product Type
        </h3>
        <select
          value={selectedType}
          onChange={(event) => {
            setSelectedType(event.target.value);
            setVisibleCount(INITIAL_BATCH);
          }}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
        >
          {types.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      {tags.length > 1 ? (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Tags</h3>
          <select
            value={selectedTag}
            onChange={(event) => {
              setSelectedTag(event.target.value);
              setVisibleCount(INITIAL_BATCH);
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
          >
            {tags.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </div>
      ) : null}

      {dynamicFilterFields.map((field) => (
        <div key={field.key}>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            {field.label}
          </h3>
          <select
            value={selectedMetafields[field.key] || 'All'}
            onChange={(event) => updateMetafieldFilter(field.key, event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
          >
            {field.values.map((value) => (
              <option key={`${field.key}-${value}`}>{value}</option>
            ))}
          </select>
        </div>
      ))}

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
          Price Range
        </h3>
        <input
          type="range"
          min={0}
          max={Math.max(maxDetectedPrice || 0, 5000)}
          step={50}
          value={maxPrice || maxDetectedPrice || 5000}
          onChange={(event) => {
            setMaxPrice(Number(event.target.value));
            setVisibleCount(INITIAL_BATCH);
          }}
          className="w-full accent-primary"
        />
        <p className="mt-2 text-xs text-gray-500">
          Up to {new Intl.NumberFormat('en-US').format(maxPrice || maxDetectedPrice || 5000)}
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={availabilityOnly}
          onChange={(event) => {
            setAvailabilityOnly(event.target.checked);
            setVisibleCount(INITIAL_BATCH);
          }}
        />
        In-stock only
      </label>

      <button
        onClick={resetFilters}
        className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <section>
      {title || description ? (
        <div className="mb-8 max-w-3xl">
          {title ? (
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base">{description}</p>
          ) : null}
        </div>
      ) : null}

      {showCollectionSwitch && collections.length ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {collectionOptions.map((collection) => (
            <button
              key={collection.handle}
              onClick={() => {
                setSelectedCollection(collection.handle);
                setVisibleCount(INITIAL_BATCH);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCollection === collection.handle
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              {collection.title}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
              <h3 className="font-semibold text-gray-900">Dynamic Filters</h3>
            </div>
            {filters}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 lg:hidden">
            <button
              onClick={() => setFiltersOpen((current) => !current)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Filters
            </button>
            {filtersOpen ? (
              <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
                {filters}
              </div>
            ) : null}
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{visibleProducts.length}</span>{' '}
              of <span className="font-semibold text-primary">{filteredProducts.length}</span>{' '}
              products
            </p>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setVisibleCount(INITIAL_BATCH);
              }}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              {['Featured', 'Price: Low to High', 'Price: High to Low', 'Title'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          {visibleProducts.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id || index} product={product} staggerIndex={index % 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-black/5 bg-white/60 px-6 py-14 text-center shadow-sm shadow-black/5">
              <span className="material-symbols-outlined mb-3 block text-[48px] text-gray-300">
                inventory_2
              </span>
              <h3 className="font-display text-2xl font-semibold text-primary">{emptyTitle}</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
                {emptyDescription}
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 text-sm font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {hasMoreProducts ? (
            <div ref={sentinelRef} className="mt-8 flex items-center justify-center py-8">
              <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
                Loading more
              </div>
            </div>
          ) : filteredProducts.length > INITIAL_BATCH ? (
            <div className="mt-8 py-6 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
              You&apos;ve reached the end of this feed
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
