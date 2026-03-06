import Image from 'next/image';
import Link from 'next/link';

/**
 * Showrooms Component (Stitch Translation)
 */
export default function Showrooms() {
  const showrooms = [
    {
      city: "New York",
      address: "125 Greene Street, Soho, NY 10012",
      img: "/assets/home/showroom-ny.jpg"
    },
    {
      city: "Copenhagen",
      address: "Bredgade 22, 1260 København K",
      img: "/assets/home/showroom-cp.jpg"
    }
  ];

  return (
    <section className="mb-20" data-test="showrooms">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-display font-semibold text-primary mb-2">Our Showrooms</h2>
          <p className="text-gray-600">Experience our collections in person.</p>
        </div>
        <Link href="/locations" className="text-primary font-semibold flex items-center hover:underline" data-test="view-locations">
          View All Locations
          <span className="material-symbols-outlined ml-2">arrow_forward</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showrooms.map((room, idx) => (
          <div key={idx} className="relative group rounded-2xl overflow-hidden min-h-[400px]">
            <Image 
                src={room.img}
                alt={`${room.city} Showroom`}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-display font-semibold text-white mb-2">{room.city}</h3>
              <p className="text-gray-300 mb-6">{room.address}</p>
              <Link href={`/locations/${room.city.toLowerCase().replace(' ', '-')}`} className="text-white font-medium hover:underline flex items-center w-max">
                  Book a Consultation
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
