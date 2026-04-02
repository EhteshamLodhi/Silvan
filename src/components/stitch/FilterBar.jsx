'use client';
import { useState, useRef, useEffect } from 'react';

const FILTER_OPTIONS = {
  category: ['Seating', 'Tables', 'Storage', 'Beds', 'Shelving'],
  woodType: ['American Walnut', 'White Oak', 'Rock Maple', 'Honey Pine', 'Ash'],
  priceRange: ['Under $500', '$500 – $1,500', '$1,500 – $3,000', '$3,000+'],
  roomType: ['Living Room', 'Dining Room', 'Bedroom', 'Office'],
};

/* ─── Desktop Filter Pill ─────────────────────────────────── */
function FilterPill({ label, icon, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center px-4 py-3 border border-gray-100 rounded-full hover:border-gray-300 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <span className="material-symbols-outlined text-gray-400 mr-3 text-[20px]">{icon}</span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider leading-none mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-gray-900 leading-none">{value}</p>
        </div>
        <span className="material-symbols-outlined text-gray-400 text-sm ml-auto">expand_more</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 w-52 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${value === opt ? 'text-primary font-semibold' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Mobile Filter Row ───────────────────────────────────── */
function MobileFilterRow({ label, icon, value, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">{icon}</span>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-900 leading-none">{value}</p>
          </div>
        </div>
        <span
          className="material-symbols-outlined text-gray-400 text-[20px] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="mt-1.5 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setOpen(false); }}
              className={`w-full text-left px-5 py-3.5 text-sm border-b border-gray-50 last:border-0 transition-colors ${value === opt ? 'text-primary font-semibold bg-orange-50/40' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {value === opt && (
                <span className="material-symbols-outlined text-primary text-[14px] mr-2 align-middle">check</span>
              )}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main FilterBar ──────────────────────────────────────── */
export default function FilterBar({ onSearch }) {
  const [filters, setFilters] = useState({
    category: 'Seating',
    woodType: 'American Walnut',
    priceRange: '$500 – $3,000',
    roomType: 'Living Room',
  });

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSearch() {
    // MAP: wire to real Shopify product filter query
    console.log('Active filters:', filters);
    if (onSearch) onSearch(filters);
  }

  const filterFields = [
    { key: 'category',   label: 'Category',    icon: 'category', options: FILTER_OPTIONS.category   },
    { key: 'woodType',   label: 'Wood Type',   icon: 'forest',   options: FILTER_OPTIONS.woodType   },
    { key: 'priceRange', label: 'Price Range', icon: 'payments', options: FILTER_OPTIONS.priceRange },
    { key: 'roomType',   label: 'Room Type',   icon: 'chair',    options: FILTER_OPTIONS.roomType   },
  ];

  return (
    <>
      {/* ── Desktop version (md and up) ─────────────────── */}
      <div
        className="hidden md:flex bg-white rounded-full shadow-lg border border-gray-100 p-2 mx-auto w-full items-center gap-2 mb-16"
        data-test="filter-bar-desktop"
      >
        {filterFields.map(({ key, label, icon, options }) => (
          <FilterPill
            key={key}
            label={label}
            icon={icon}
            value={filters[key]}
            options={options}
            onSelect={(v) => setFilter(key, v)}
          />
        ))}

        <div className="ml-auto pl-2 shrink-0">
          <button
            onClick={handleSearch}
            className="px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-colors"
            data-test="search-btn"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Mobile version (below md) ────────────────────── */}
      <div
        className="md:hidden bg-white rounded-3xl shadow-md border border-gray-100 p-4 mx-auto w-full mb-12"
        data-test="filter-bar-mobile"
      >
        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3 px-1">Filter Products</p>

        <div className="flex flex-col gap-2">
          {filterFields.map(({ key, label, icon, options }) => (
            <MobileFilterRow
              key={key}
              label={label}
              icon={icon}
              value={filters[key]}
              options={options}
              onSelect={(v) => setFilter(key, v)}
            />
          ))}
        </div>

        <button
          onClick={handleSearch}
          className="mt-4 w-full py-4 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-colors text-sm tracking-wide"
          data-test="search-btn-mobile"
        >
          Search
        </button>
      </div>
    </>
  );
}
