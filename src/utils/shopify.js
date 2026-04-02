const SHOPIFY_API_VERSION = '2024-01';

const PRODUCT_METAFIELD_IDENTIFIERS = `
  [
    { namespace: "custom", key: "material" }
    { namespace: "custom", key: "dimensions" }
    { namespace: "custom", key: "sustainability" }
    { namespace: "custom", key: "customization_options" }
    { namespace: "custom", key: "brand_category" }
    { namespace: "custom", key: "color" }
    { namespace: "custom", key: "size" }
    { namespace: "custom", key: "room_category" }
    { namespace: "custom", key: "dimension" }
    { namespace: "custom", key: "wood_type" }
    { namespace: "custom", key: "finish" }
    { namespace: "custom", key: "style" }
    { namespace: "custom", key: "usage_space" }
    { namespace: "custom", key: "seo_title" }
    { namespace: "custom", key: "seo_description" }
  ]
`;

const COLLECTION_METAFIELD_IDENTIFIERS = `
  [
    { namespace: "custom", key: "brand" }
    { namespace: "custom", key: "scene_products" }
    { namespace: "custom", key: "scene_image" }
    { namespace: "custom", key: "room_category" }
    { namespace: "custom", key: "usage_space" }
    { namespace: "custom", key: "banner_subtitle" }
    { namespace: "custom", key: "material_focus" }
    { namespace: "custom", key: "sustainability" }
    { namespace: "custom", key: "seo_title" }
    { namespace: "custom", key: "seo_description" }
  ]
`;

const CUSTOMER_METAFIELD_IDENTIFIERS = `
  [
    { namespace: "custom", key: "preferred_material" }
    { namespace: "custom", key: "trade_account" }
  ]
`;

const ORDER_METAFIELD_IDENTIFIERS = `
  [
    { namespace: "custom", key: "delivery_notes" }
    { namespace: "custom", key: "sustainability_summary" }
  ]
`;

const PRODUCT_CARD_FRAGMENT = `
  id
  title
  handle
  description
  availableForSale
  tags
  vendor
  productType
  featuredImage {
    url
    altText
    width
    height
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    maxVariantPrice {
      amount
      currencyCode
    }
  }
  options {
    id
    name
    values
  }
  variants(first: 25) {
    edges {
      node {
        id
        title
        availableForSale
        currentlyNotInStock
        quantityAvailable
        sku
        barcode
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
  metafields(identifiers: ${PRODUCT_METAFIELD_IDENTIFIERS}) {
    namespace
    key
    value
    type
  }
`;

function getShopifyEndpoint() {
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

function mapConnection(connection) {
  return connection?.edges?.map((edge) => edge.node) || [];
}

function sanitizeMenuPath(url) {
  if (!url) {
    return '#';
  }

  try {
    const parsed = new URL(url);
    const path = parsed.pathname || '/';

    if (path === '/' || path === '') {
      return '/';
    }

    if (path === '/collections/all') {
      return '/collections';
    }

    if (path.startsWith('/pages/contact')) {
      return '/contact';
    }

    return path;
  } catch {
    return url.startsWith('/') ? url : '#';
  }
}

export function isShopifyConfigured() {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

export async function shopifyFetch({ query, variables, cache = 'force-cache', tags }) {
  const endpoint = getShopifyEndpoint();
  const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!isShopifyConfigured()) {
    throw new Error('Shopify storefront environment variables are missing.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': key,
    },
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags && { next: { tags } }),
  });

  const body = await response.json();
  if (body.errors) {
    throw body.errors[0];
  }

  return {
    status: response.status,
    body,
  };
}

export function getVariantInventoryLabel(variant) {
  if (!variant) {
    return 'Unavailable';
  }

  if (!variant.availableForSale) {
    return 'Sold out';
  }

  if (variant.currentlyNotInStock) {
    return 'Backorder available';
  }

  if (typeof variant.quantityAvailable === 'number' && variant.quantityAvailable <= 5) {
    return `Only ${variant.quantityAvailable} left`;
  }

  return 'In stock';
}

export async function getMenu(handle = 'main-menu') {
  const query = `
    query getMenu($handle: String!) {
      menu(handle: $handle) {
        title
        handle
        items {
          title
          url
          type
          resourceId
          items {
            title
            url
            type
            resourceId
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { handle },
      cache: 'force-cache',
      tags: [`menu-${handle}`],
    });

    const menu = response.body?.data?.menu;
    if (!menu) {
      return null;
    }

    return {
      ...menu,
      items: (menu.items || []).map((item) => ({
        ...item,
        path: sanitizeMenuPath(item.url),
        items: (item.items || []).map((child) => ({
          ...child,
          path: sanitizeMenuPath(child.url),
        })),
      })),
    };
  } catch (error) {
    console.error('getMenu error:', error);
    return null;
  }
}

export async function getCollections(limit = 10) {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            metafields(identifiers: ${COLLECTION_METAFIELD_IDENTIFIERS}) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit },
      cache: 'force-cache',
      tags: ['collections'],
    });

    return mapConnection(response.body?.data?.collections);
  } catch (error) {
    console.error('getCollections error:', error);
    return [];
  }
}

export async function getCollectionsPage(limit = 24, after = null) {
  const query = `
    query getCollectionsPage($first: Int!, $after: String) {
      collections(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            metafields(identifiers: ${COLLECTION_METAFIELD_IDENTIFIERS}) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit, after },
      cache: 'force-cache',
      tags: ['collections'],
    });

    const connection = response.body?.data?.collections;
    return {
      collections: mapConnection(connection),
      pageInfo: connection?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('getCollectionsPage error:', error);
    return {
      collections: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export async function getAllCollections(limit = 100) {
  const collections = [];
  let cursor = null;

  while (collections.length < limit) {
    const { collections: batch, pageInfo } = await getCollectionsPage(
      Math.min(24, limit - collections.length),
      cursor,
    );

    collections.push(...batch);

    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
      break;
    }

    cursor = pageInfo.endCursor;
  }

  return collections.slice(0, limit);
}

export async function getCollectionByHandle(handle, productLimit = 50) {
  const query = `
    query getCollectionByHandle($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image {
          url
          altText
        }
        metafields(identifiers: ${COLLECTION_METAFIELD_IDENTIFIERS}) {
          namespace
          key
          value
          type
        }
        products(first: $first) {
          edges {
            node {
              ${PRODUCT_CARD_FRAGMENT}
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { handle, first: productLimit },
      cache: 'force-cache',
      tags: [`collection-${handle}`],
    });

    return response.body?.data?.collectionByHandle || null;
  } catch (error) {
    console.error('getCollectionByHandle error:', error);
    return null;
  }
}

export async function getProducts(limit = 12) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ${PRODUCT_CARD_FRAGMENT}
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit },
      cache: 'force-cache',
      tags: ['products'],
    });

    return mapConnection(response.body?.data?.products);
  } catch (error) {
    console.error('getProducts error:', error);
    return [];
  }
}

export async function getProductsPage(limit = 24, after = null, queryText = '') {
  const query = `
    query getProductsPage($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ${PRODUCT_CARD_FRAGMENT}
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit, after, query: queryText || null },
      cache: queryText ? 'no-store' : 'force-cache',
      tags: queryText ? undefined : ['products'],
    });

    const connection = response.body?.data?.products;

    return {
      products: mapConnection(connection),
      pageInfo: connection?.pageInfo || { hasNextPage: false, endCursor: null },
    };
  } catch (error) {
    console.error('getProductsPage error:', error);
    return {
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export async function getAllProducts(limit = 150, queryText = '') {
  const products = [];
  let cursor = null;

  while (products.length < limit) {
    const { products: batch, pageInfo } = await getProductsPage(
      Math.min(24, limit - products.length),
      cursor,
      queryText,
    );

    products.push(...batch);

    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) {
      break;
    }

    cursor = pageInfo.endCursor;
  }

  return products.slice(0, limit);
}

export async function getProductByHandle(handle) {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_CARD_FRAGMENT}
        descriptionHtml
        seo {
          title
          description
        }
        media(first: 20) {
          edges {
            node {
              mediaContentType
              alt
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
              ... on Model3d {
                previewImage {
                  url
                  altText
                  width
                  height
                }
                sources {
                  url
                  mimeType
                  format
                }
              }
              ... on Video {
                sources {
                  url
                  mimeType
                  format
                  height
                  width
                }
                previewImage {
                  url
                  altText
                }
              }
              ... on ExternalVideo {
                embeddedUrl
                host
                originUrl
                previewImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: { handle },
    cache: 'no-store',
  });

  return response.body?.data?.product || null;
}

export async function searchProducts(searchTerm, limit = 24) {
  if (!searchTerm) {
    return [];
  }

  const query = `
    query searchProducts($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ${PRODUCT_CARD_FRAGMENT}
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit, query: searchTerm },
      cache: 'no-store',
    });
    return mapConnection(response.body?.data?.products);
  } catch (error) {
    console.error('searchProducts error:', error);
    return [];
  }
}

export async function searchCollections(searchTerm, limit = 12) {
  if (!searchTerm) {
    return [];
  }

  const query = `
    query searchCollections($first: Int!, $query: String!) {
      collections(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            metafields(identifiers: ${COLLECTION_METAFIELD_IDENTIFIERS}) {
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { first: limit, query: searchTerm },
      cache: 'no-store',
    });
    return mapConnection(response.body?.data?.collections);
  } catch (error) {
    console.error('searchCollections error:', error);
    return [];
  }
}

export async function getPredictiveSearchResults(searchTerm, limit = 5) {
  const [products, collections] = await Promise.all([
    searchProducts(searchTerm, limit),
    searchCollections(searchTerm, limit),
  ]);

  return {
    products: products.slice(0, limit),
    collections: collections.slice(0, limit),
  };
}

export async function getAllCollectionHandles(limit = 50) {
  const collections = await getCollections(limit);
  return collections.map((collection) => collection.handle).filter(Boolean);
}

export async function getAllProductHandles(limit = 100) {
  const products = await getProducts(limit);
  return products.map((product) => product.handle).filter(Boolean);
}

export async function getCustomerByAccessToken(customerAccessToken) {
  if (!customerAccessToken) {
    return null;
  }

  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        displayName
        email
        phone
        acceptsMarketing
        defaultAddress {
          id
          address1
          address2
          city
          province
          country
          zip
          formatted
        }
        addresses(first: 10) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              country
              zip
              formatted
            }
          }
        }
        metafields(identifiers: ${CUSTOMER_METAFIELD_IDENTIFIERS}) {
          namespace
          key
          value
          type
        }
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name
              orderNumber
              processedAt
              fulfillmentStatus
              financialStatus
              statusUrl
              totalPrice {
                amount
                currencyCode
              }
              metafields(identifiers: ${ORDER_METAFIELD_IDENTIFIERS}) {
                namespace
                key
                value
                type
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: { customerAccessToken },
      cache: 'no-store',
    });
    return response.body?.data?.customer || null;
  } catch (error) {
    console.error('getCustomerByAccessToken error:', error);
    return null;
  }
}

export async function createCustomer(input) {
  const mutation = `
    mutation createCustomer($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query: mutation,
    variables: { input },
    cache: 'no-store',
  });

  return response.body?.data?.customerCreate;
}

export async function createCustomerAccessToken(input) {
  const mutation = `
    mutation createCustomerAccessToken($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query: mutation,
    variables: { input },
    cache: 'no-store',
  });

  return response.body?.data?.customerAccessTokenCreate;
}

export async function recoverCustomerAccount(email) {
  const mutation = `
    mutation recoverCustomer($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query: mutation,
    variables: { email },
    cache: 'no-store',
  });

  return response.body?.data?.customerRecover;
}

export async function deleteCustomerAccessToken(customerAccessToken) {
  if (!customerAccessToken) {
    return null;
  }

  const mutation = `
    mutation deleteCustomerAccessToken($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query: mutation,
    variables: { customerAccessToken },
    cache: 'no-store',
  });

  return response.body?.data?.customerAccessTokenDelete;
}

export const cartCreateMutation = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes {
          applicable
          code
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const cartLinesAddMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes {
          applicable
          code
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const cartLinesUpdateMutation = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes {
          applicable
          code
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const cartLinesRemoveMutation = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes {
          applicable
          code
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const cartDiscountCodesUpdateMutation = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        checkoutUrl
        totalQuantity
        discountCodes {
          applicable
          code
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  sku
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
      warnings {
        code
        message
      }
    }
  }
`;

export const getCartQuery = `
  query getCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      discountCodes {
        applicable
        code
      }
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                sku
                availableForSale
                currentlyNotInStock
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                product {
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
