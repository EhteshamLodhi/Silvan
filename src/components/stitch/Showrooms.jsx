'use client';
import Image from 'next/image';
import Link from 'next/link';
import useScrollReveal from '../../hooks/useScrollReveal';

const showrooms = [
  {
    city: 'New York',
    address: '125 Greene Street, Soho, NY 10012',
    img: '/assets/home/showroom-ny.jpg',
    slug: 'new-york',
  },
  {
    city: 'Copenhagen',
    address: 'Bredgade 22, 1260 København K',
    img: '/assets/home/showroom-cp.jpg',
    slug: 'copenhagen',
  },
];

export default function Showrooms() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="mb-20" data-test="showrooms">
      {/* Header row */}
      <div ref={ref} className={`flex items-end justify-between mb-10 fade-up ${isVisible ? 'visible' : ''}`}>
        <div>
          <h2 className="font-display text-3xl font-semibold text-primary mb-1">Our Showrooms</h2>
          <p className="text-gray-500 text-sm">Experience our collections in person.</p>
        </div>
        <Link href="/locations" className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline shrink-0" data-test="view-locations">
          View All Locations
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showrooms.map((room, idx) => (
          <ShowroomCard key={room.slug} room={room} delay={idx * 0.12} />
        ))}
      </div>
    </section>
  );
}

function ShowroomCard({ room, delay }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`relative group rounded-2xl overflow-hidden min-h-[380px] fade-up ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <Image
        src={room.img}
        alt={`${room.city} Showroom`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="font-display text-3xl font-semibold text-white mb-2">{room.city}</h3>
        <p className="text-gray-300 text-sm mb-5">{room.address}</p>
        <Link
          href={`/locations/${room.slug}`}
          className="text-white font-medium hover:underline flex items-center gap-1 w-max text-sm"
        >
          Book a Consultation
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
