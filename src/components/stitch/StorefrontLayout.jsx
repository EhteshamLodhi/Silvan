import Footer from './Footer';
import Header from './Header';

export default function StorefrontLayout({
  children,
  className = '',
  mainClassName = 'max-w-7xl mx-auto px-4 md:px-8 py-12',
}) {
  return (
    <div className={`min-h-screen bg-[#F5F0E6] text-gray-900 ${className}`.trim()}>
      <Header />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  );
}
