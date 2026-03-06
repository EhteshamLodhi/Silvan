import Link from 'next/link';

export default function CollectionsPlaceholder() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '10rem 5%' }}>
      <h1 className="section-title">All Collections</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        View all our curated collections here. (Placeholder for Connectivity Verification)
      </p>
      <Link href="/collections/all" className="button-primary">
        View &quot;All&quot; Collection
      </Link>
    </div>
  );
}
