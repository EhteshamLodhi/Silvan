const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const siteConfig = {
  name: 'Silvan & Co.',
  shortName: 'Silvan',
  description:
    'Timeless wooden furniture crafted with premium materials, thoughtful detailing, and a quieter approach to modern living.',
  url: siteUrl,
  ogImage: `${siteUrl}/assets/home/hero-bg.jpg`,
  locale: 'en_US',
  socials: {
    instagram: 'https://www.instagram.com/',
    pinterest: 'https://www.pinterest.com/',
  },
};

export const headerNavigation = [
  { href: '/collections', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/contact', label: 'Contact' },
];

export const footerGroups = [
  {
    title: 'Shop',
    links: [
      { href: '/collections', label: 'Collections' },
      { href: '/search', label: 'Search' },
      { href: '/cart', label: 'Cart' },
      { href: '/account', label: 'Account' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/sustainability', label: 'Sustainability' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/shipping', label: 'Shipping Policy' },
      { href: '/returns', label: 'Returns & Refund Policy' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  },
];

export const policyPageContent = {
  about: {
    title: 'About Silvan & Co.',
    description:
      'Silvan & Co. curates enduring wooden furniture for homes that value quiet craftsmanship, honest materials, and longevity over trends.',
    intro:
      'We build around the idea that good furniture should age with grace. Every silhouette, wood finish, and proportion is chosen to feel grounded today and still relevant years from now.',
    sections: [
      {
        heading: 'Our Philosophy',
        body: [
          'We focus on pieces that live well in real homes: generous storage, durable surfaces, and materials that become richer with use.',
          'Each collection is shaped around tactile finishes, balanced proportions, and versatility so customers can move between spaces without replacing their entire environment.',
        ],
      },
      {
        heading: 'How We Work',
        body: [
          'Our assortment is curated with an emphasis on traceable sourcing, thoughtful joinery, and consistent finishing standards.',
          'We collaborate with specialist workshops that understand the demands of small-batch production, custom requests, and quality control at every stage.',
        ],
      },
      {
        heading: 'What Customers Can Expect',
        body: [
          'Clear product information, reliable order updates, and a support experience that feels personal rather than transactional.',
          'Furniture should be a long-term relationship. We are here to help before purchase, during delivery, and long after installation.',
        ],
      },
    ],
  },
  sustainability: {
    title: 'Sustainability',
    description:
      'Our sustainability approach centers on durable materials, responsible sourcing, and reducing waste through better product decisions.',
    intro:
      'We believe sustainability begins with restraint: fewer, better objects made from materials intended to last. Our goal is to reduce waste by designing products worth keeping.',
    sections: [
      {
        heading: 'Responsible Materials',
        body: [
          'We prioritize responsibly sourced wood, durable finishes, and production partners that can document their supply chain standards.',
          'When a material cannot meet our longevity or sourcing expectations, it does not make it into the collection.',
        ],
      },
      {
        heading: 'Built For Long Use',
        body: [
          'Longevity is one of the most practical forms of sustainability. Our product selection favors repairable construction, timeless forms, and finishes that wear beautifully.',
          'We share care guidance so customers can extend the life of each piece through regular maintenance and mindful placement.',
        ],
      },
      {
        heading: 'Lower Waste Operations',
        body: [
          'We work to keep packaging efficient, reduce unnecessary handling, and avoid overproduced inventory where possible.',
          'As we grow, we will continue improving logistics, packaging materials, and supplier accountability to reduce our footprint further.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    description:
      'Review fulfillment timelines, delivery expectations, and what to expect once your Silvan & Co. order has been placed.',
    intro:
      'We aim to make delivery clear and predictable. Timelines vary by inventory status, destination, and whether a piece is made to order.',
    sections: [
      {
        heading: 'Order Processing',
        body: [
          'In-stock items typically begin processing within 1 to 3 business days. Made-to-order and custom products may require additional production time before dispatch.',
          'Once an order is confirmed, you will receive email updates as it moves through processing, shipment, and delivery scheduling.',
        ],
      },
      {
        heading: 'Delivery Timelines',
        body: [
          'Standard parcel deliveries usually arrive within 3 to 7 business days after dispatch. Large-item freight deliveries may require appointment coordination and longer transit windows.',
          'Remote locations, holiday volume, weather disruptions, or carrier delays can affect final delivery timing.',
        ],
      },
      {
        heading: 'Inspection On Arrival',
        body: [
          'Please inspect your order as soon as it arrives and document any visible damage before assembly or use.',
          'If something is not right, contact us promptly so we can help with the appropriate next steps.',
        ],
      },
    ],
  },
  returns: {
    title: 'Returns & Refund Policy',
    description:
      'Understand how returns, exchanges, and refunds are handled for standard, made-to-order, and custom Silvan & Co. purchases.',
    intro:
      'We want every purchase to feel considered and confident. If an item is not the right fit, we will guide you through the available return or exchange options.',
    sections: [
      {
        heading: 'Eligibility',
        body: [
          'Unused standard items in original condition may be eligible for return within the stated return window. Proof of purchase is required for all returns.',
          'Made-to-order, personalized, or final-sale items may not be eligible unless they arrive damaged or defective.',
        ],
      },
      {
        heading: 'Refund Timing',
        body: [
          'Approved refunds are issued to the original payment method after the returned item has been inspected. Processing time can vary depending on your payment provider.',
          'Original delivery charges, return shipping, or restocking fees may be deducted where applicable and disclosed before confirmation.',
        ],
      },
      {
        heading: 'Damaged Or Incorrect Orders',
        body: [
          'If your order arrives damaged, incomplete, or incorrect, contact us as soon as possible with your order number and photos of the issue.',
          'We will review the claim and arrange the most suitable resolution, which may include replacement parts, exchange, or refund.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Learn how Silvan & Co. collects, uses, stores, and protects personal information across the storefront experience.',
    intro:
      'Your privacy matters to us. We collect only the information needed to operate the store, fulfill orders, improve the site experience, and communicate clearly with customers.',
    sections: [
      {
        heading: 'Information We Collect',
        body: [
          'This may include account details, order information, delivery details, payment-related metadata, and browsing activity necessary to operate the storefront.',
          'Some information may be collected automatically through analytics, cookies, or device data when you interact with the site.',
        ],
      },
      {
        heading: 'How Information Is Used',
        body: [
          'We use customer information to process orders, provide support, personalize communication, detect fraud, and improve performance across the store.',
          'We do not sell personal information. Data may be shared only with service providers needed for payments, shipping, hosting, analytics, or legal compliance.',
        ],
      },
      {
        heading: 'Your Choices',
        body: [
          'You may request access to, correction of, or deletion of eligible personal information, subject to legal and operational requirements.',
          'Marketing communications can be opted out of at any time using the unsubscribe instructions provided in email messages.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    description:
      'Review the terms governing use of the Silvan & Co. website, product information, purchases, and related services.',
    intro:
      'By using this website or placing an order, you agree to the terms that govern access to our storefront, product information, and related services.',
    sections: [
      {
        heading: 'Use Of The Website',
        body: [
          'You agree to use the site only for lawful purposes and not to interfere with its operation, security, or availability.',
          'We may update or discontinue content, products, or features at any time without prior notice when needed for operational reasons.',
        ],
      },
      {
        heading: 'Orders And Pricing',
        body: [
          'Product availability, pricing, and descriptions may change. We reserve the right to limit quantities, correct errors, or cancel orders affected by inaccurate information.',
          'A submitted order does not guarantee acceptance until payment is authorized and fulfillment is confirmed.',
        ],
      },
      {
        heading: 'Liability',
        body: [
          'To the extent allowed by law, Silvan & Co. is not liable for indirect, incidental, or consequential damages arising from use of the site or purchased products.',
          'Nothing in these terms limits rights that cannot be waived under applicable consumer protection laws.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    description:
      'This policy explains how cookies and related technologies support browsing, analytics, and store functionality on Silvan & Co.',
    intro:
      'Cookies help the storefront remember preferences, keep essential features working, and measure how the site is used so we can improve it responsibly.',
    sections: [
      {
        heading: 'Essential Cookies',
        body: [
          'These cookies support core storefront functionality such as security, session continuity, cart persistence, and page performance.',
          'Disabling essential cookies may affect how parts of the site operate.',
        ],
      },
      {
        heading: 'Analytics Cookies',
        body: [
          'Analytics tools may use cookies to understand traffic patterns, product interest, and experience quality across devices and routes.',
          'We use this information in aggregated form to improve navigation, content clarity, and conversion flows.',
        ],
      },
      {
        heading: 'Managing Preferences',
        body: [
          'Most browsers let you review, limit, or delete cookies through privacy settings.',
          'Some experiences may be less personalized if optional cookies are disabled.',
        ],
      },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions about materials, delivery, returns, made-to-order furniture, and ongoing care.',
    intro:
      'These are the questions customers ask most often before and after ordering. If you need something more specific, our team is happy to help.',
    faqs: [
      {
        question: 'Do you offer made-to-order pieces?',
        answer:
          'Yes. Selected products can be produced in alternate finishes, dimensions, or material combinations depending on the collection and workshop capacity.',
      },
      {
        question: 'How do I know when an item will ship?',
        answer:
          'Each product will have an estimated lead time, and we send follow-up updates as the order moves through processing and dispatch.',
      },
      {
        question: 'Can I return a custom order?',
        answer:
          'Custom and personalized products are typically final sale unless they arrive damaged or materially different from the approved specification.',
      },
      {
        question: 'How should I care for wood furniture?',
        answer:
          'Use a soft dry cloth for routine cleaning, avoid prolonged moisture exposure, and keep pieces away from direct heat or intense sunlight where possible.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'International availability depends on product size, destination, and carrier support. Contact us with the item and destination for a tailored quote.',
      },
    ],
  },
};

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noIndex = false,
}) {
  const allowedOpenGraphTypes = new Set([
    'website',
    'article',
    'book',
    'profile',
    'music.song',
    'music.album',
    'music.playlist',
    'music.radio_station',
    'video.movie',
    'video.episode',
    'video.tv_show',
    'video.other',
  ]);
  const openGraphType = allowedOpenGraphTypes.has(type) ? type : 'website';

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || siteConfig.ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function getShopifyAccountUrl(path = '') {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    return null;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `https://${domain}${normalizedPath}`;
}
