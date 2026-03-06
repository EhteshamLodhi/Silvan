import Link from 'next/link';

/**
 * Footer Component (Stitch Translation)
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 pt-12 pb-8 text-sm text-gray-500" data-test="footer">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-display font-semibold text-primary text-xl">Silvan & Co.</div>
        <div className="flex space-x-6">
          <Link href="/shipping" className="hover:text-primary">Shipping</Link>
          <Link href="/returns" className="hover:text-primary">Returns</Link>
          <Link href="/privacy" className="hover:text-primary">Privacy</Link>
          <Link href="/sustainability" className="hover:text-primary">Sustainability</Link>
        </div>
        <div>© {new Date().getFullYear()} Silvan & Co. All rights reserved.</div>
      </div>
    </footer>
  );
}
