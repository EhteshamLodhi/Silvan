/**
 * BespokeService Component (Stitch Translation)
 */
export default function BespokeService() {
  return (
    <div className="blueprint-pattern rounded-[2rem] p-8 flex-grow flex flex-col justify-center relative overflow-hidden shadow-xl" data-test="bespoke-service">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-9xl">architecture</span>
      </div>
      <div className="relative z-10">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Bespoke Service
        </span>
        <h2 className="text-3xl font-display font-semibold text-white mb-3">Create Your Own Piece</h2>
        <p className="text-accent/80 text-sm mb-8 leading-relaxed max-w-[240px]">
           Work with our master craftsmen to design furniture tailored to your space.
        </p>
        <button className="w-full py-4 bg-white text-primary rounded-full text-sm font-bold hover:bg-accent transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 group">
          <span>Start Designing</span>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">edit_note</span>
        </button>
      </div>
    </div>
  );
}
