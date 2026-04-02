import Image from 'next/image';

export default function ProductGallery({ images }) {
  if (!images || images.edges.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main" />
      </div>
    );
  }

  const allImages = images.edges.map(edge => edge.node);
  const mainImage = allImages[0];
  const thumbs = allImages.slice(1, 5);

  return (
    <div className="product-gallery">
      {mainImage && (
        <div className="product-gallery-main">
          <Image
            src={mainImage.url}
            alt={mainImage.altText || 'Product Image'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="product-image"
            priority
          />
        </div>
      )}
      {thumbs.map((img, index) => (
        <div key={index} className="product-gallery-thumb">
          <Image
            src={img.url}
            alt={img.altText || `Product Image ${index + 2}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="product-image"
          />
        </div>
      ))}
    </div>
  );
}
