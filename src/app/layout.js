import './globals.css';
import { CartProvider } from '../context/CartContext';
import { CustomerProvider } from '../context/CustomerContext';
import CartSidebar from '../components/CartSidebar';
import { buildMetadata, siteConfig } from '../lib/site';

const rootSeo = buildMetadata({
  title: `${siteConfig.name} | Premium Wooden Furniture`,
  description: siteConfig.description,
  path: '/',
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium Wooden Furniture`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: rootSeo.alternates,
  openGraph: rootSeo.openGraph,
  twitter: rootSeo.twitter,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="antialiased">
        <CustomerProvider>
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
