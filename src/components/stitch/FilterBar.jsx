/**
 * FilterBar Component (Stitch Translation)
 */
export default function FilterBar() {
  return (
    <div className="bg-white rounded-full shadow-lg border border-gray-100 p-2 mx-auto w-full max-w-5xl flex flex-wrap md:flex-nowrap items-center gap-2 mb-16" data-test="filter-bar">
      <div className="flex-1 flex items-center px-4 py-3 border border-gray-100 rounded-full min-w-[150px]">
        <span className="material-symbols-outlined text-gray-400 mr-3">category</span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Category</p>
          <p className="text-sm font-semibold text-gray-900">Seating</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center px-4 py-3 border border-gray-100 rounded-full min-w-[150px]">
        <span className="material-symbols-outlined text-gray-400 mr-3">forest</span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Wood Type</p>
          <p className="text-sm font-semibold text-gray-900">American Walnut</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center px-4 py-3 border border-gray-100 rounded-full min-w-[150px]">
        <span className="material-symbols-outlined text-gray-400 mr-3">payments</span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Price Range</p>
          <p className="text-sm font-semibold text-gray-900">$500 - $3,000</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center px-4 py-3 border border-gray-100 rounded-full min-w-[150px]">
        <span className="material-symbols-outlined text-gray-400 mr-3">chair</span>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Room Type</p>
          <p className="text-sm font-semibold text-gray-900">Living Room</p>
        </div>
      </div>
      
      <button className="px-6 py-3 flex items-center border border-gray-100 rounded-full hover:bg-gray-50 transition-colors">
        <span className="material-symbols-outlined text-gray-500 mr-2">tune</span>
        <span className="text-sm font-semibold">More</span>
      </button>
      
      <div className="ml-auto pl-4 pr-2 py-1">
        <button className="px-10 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-colors w-full md:w-auto" data-test="search-btn">
            Search
        </button>
      </div>
    </div>
  );
}
