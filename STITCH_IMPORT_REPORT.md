# STITCH IMPORT REPORT (Delivery Manifest)

## Stitch Ingestion Metadata
- **Project Name**: Silvan
- **Project ID**: `4640826224805955682`
- **Screen ID**: `63fe8e2663b542f2aa210883450ed1bf`
- **Export Method**: Automated Antigravity translation logic extracting literal Tailwind classes from generated Stitch outputs.

## Files Removed/Overridden
- `src/components/Hero.jsx` -> **[DELETED]**
- `src/components/ProductCard.jsx` -> **[DELETED]**
- `src/components/BrandFilterBar.jsx` -> **[DELETED]**
- `src/components/CategoryBlock.jsx` -> **[DELETED]**
- `src/app/page.js` -> **[RESET]** (Cleared structure prepared for strict reconstruction)

## Canonical Tokens Generated
- `design-tokens.json`: Contains structured exact variable declarations matching Stitch output (`primary`, `background-light`, `accent`, etc).
- `tailwind.config.js`: Sourced direct definitions from the extracted Tailwind config present in Stitch's HTML header wrapper.

## Exact Components Recreated (1:1 Ratio)
- `src/components/stitch/Header.jsx`: Includes log-in flow, currency selector layout, and cart icons matching `nav` HTML.
- `src/components/stitch/Hero.jsx`: Contains the `w-full lg:w-[70%]` responsive grid implementation and `.bg-gradient-to-t` overlay.
- `src/components/stitch/ShopByBrand.jsx`: The side-bar module generated via iterating items matching the `border-gray-50` split.
- `src/components/stitch/BespokeService.jsx`: The blueprint-pattern promo module built utilizing custom specific absolute positioning.
- `src/components/stitch/FilterBar.jsx`: A mapped row containing icons (`material-symbols-outlined`) simulating specific property selects.
- `src/components/stitch/ProductCard.jsx`: Atomic card mapping the Shopify API data (`availableForSale`, `priceRange.minVariantPrice.amount`) inside the raw Stitch layout bounds.
- `src/components/stitch/FeaturedProducts.jsx`: Maps array iterations to the `ProductCard` explicitly mapping bounds correctly.
- `src/components/stitch/Showrooms.jsx`: Responsive layout with absolute position image covers.
- `src/components/stitch/Footer.jsx`: Strict static layout matched to `Silvan & Co.` specifications.

## Mobile / Tablet Optimizations
- Visual fidelity matches the generated Tailwind CSS strictly based on `lg:` and `md:` prefixes extracted from the explicit Stitch HTML.
- Preserved Stitch's standard linear grid collapses down to 100vw stacking modules.

## Shopify Bindings mapping (TODOs)
- **MAP**: The `ProductCard.jsx` module includes native bindings routing to Shopify `title`, `images.edges[0].node.url`, and `priceRange.minVariantPrice.amount`.
- **TODO**: In `page.js`, the generic `getProducts(3)` needs stricter bounds matching based on exact "Featured" category IDs when those IDs are established on Shopify's domain infrastructure.

## Preview Routes
- **Route**: `http://localhost:3000/dev/stitch-home`
- **Output**: The output serves interactive dynamic token visualization loops connected to literal CSS outputs demonstrating the raw configuration payload. Contains the raw rendered isolated `Home` object.
