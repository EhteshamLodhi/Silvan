import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero Component (Stitch Translation)
 * 
 * @param {Object} props
 * @param {string} props.title - Hero headline
 * @param {string} props.ctaText - Call to action text
 * @param {string} props.ctaLink - Call to action URL
 */
export default function Hero({ 
    title = "Timeless Wooden Furniture for Your Home",
    ctaText = "Shop the Collection",
    ctaLink = "/collections/all"
}) {
  return (
    <div className="w-full lg:w-[70%] relative rounded-[2rem] overflow-hidden group min-h-[500px]" data-test="hero">
        <Image 
            src="/assets/home/hero-bg.jpg" 
            alt="Sunlit living room with oak furniture"
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-semibold text-white leading-tight max-w-2xl mb-8" data-test="hero-title">
                {title}
            </h1>
            <div>
                <Link href={ctaLink} className="px-8 py-4 bg-white text-primary rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block" data-test="hero-cta">
                    {ctaText}
                </Link>
            </div>
        </div>
    </div>
  );
}
