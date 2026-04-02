'use client';
import useScrollReveal from '../../hooks/useScrollReveal';

export default function BespokeService() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`blueprint-pattern rounded-[2rem] p-10 flex-grow flex flex-col justify-center relative overflow-hidden shadow-xl fade-up ${isVisible ? 'visible' : ''}`}
      data-test="bespoke-service"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: '6rem' }}>architecture</span>
      </div>

      <div className="relative z-10">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          Bespoke Service
        </span>
        <h2 className="font-display text-3xl font-semibold text-white mb-3 leading-tight">
          Create Your Own<br />Piece
        </h2>
        <p className="text-accent/80 text-sm mb-8 leading-relaxed max-w-[220px]">
          Work with our master craftsmen to design furniture tailored to your space.
        </p>
        <button className="w-full py-3.5 bg-white text-primary rounded-full text-sm font-bold hover:bg-accent hover:text-primary transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group">
          <span>Start Designing</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform duration-200">edit_note</span>
        </button>
      </div>
    </div>
  );
}
