'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { openCart, cart } = useCart();
  const itemCount = cart?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;

  return (
    <header className="header">
      <Link href="/" className="header-logo">
        SILVAN
      </Link>
      <nav className="header-nav">
        <Link href="/" className="header-link">Home</Link>
        <Link href="/collections" className="header-link">Shop</Link>
      </nav>
      <button className="cart-button" onClick={openCart}>
        Cart ({itemCount})
      </button>
    </header>
  );
}
