import Link from 'next/link';

/**
 * Header Component (Stitch Translation)
 * 
 * @param {Object} props
 * @param {number} props.cartCount - Number of items in cart
 */
export default function Header({ cartCount = 0 }) {
  return (
    <nav className="flex items-center justify-between py-6 mb-4" data-test="header">
      <Link href="/" className="text-2xl font-display font-semibold text-primary" data-test="header-logo">
        Silvan & Co.
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link href="/collections/living" className="hover:text-primary transition-colors">Living</Link>
        <Link href="/collections/dining" className="hover:text-primary transition-colors">Dining</Link>
        <Link href="/collections/bedroom" className="hover:text-primary transition-colors">Bedroom</Link>
        <Link href="/collections/workspace" className="hover:text-primary transition-colors">Workspace</Link>
        <Link href="/collections/custom" className="hover:text-primary transition-colors">Custom Build</Link>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-primary transition-colors" aria-label="Search">
            <span className="material-symbols-outlined">search</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors" data-test="currency-selector">
            <span>USD</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
        </button>
        <Link href="/cart" className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors" data-test="cart-toggle">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && <span>({cartCount})</span>}
        </Link>
        <Link href="/account/login" className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-secondary transition-colors" data-test="login-btn">
            Log in
        </Link>
      </div>
    </nav>
  );
}
