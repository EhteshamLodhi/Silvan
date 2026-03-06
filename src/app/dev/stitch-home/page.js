import tokens from '../../../../design-tokens.json';
import Home from '../../page';

export default function DevPreview() {
  const { colors, fontFamily } = tokens.theme;

  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-4">Stitch Design Tokens (Silvan)</h1>
          <p className="text-gray-600 mb-8">Raw token output translated directly into the UI mapping layer.</p>
          
          <h2 className="text-xl font-semibold mb-4">Color Swatches</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(colors).map(([name, shadowColor]) => (
              <div key={name} className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 rounded-full shadow-md border border-gray-200"
                  style={{ backgroundColor: shadowColor }}
                />
                <span className="mt-2 text-sm font-medium capitalize">{name}</span>
                <span className="text-xs text-gray-500 uppercase">{shadowColor}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Typography Tokens</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-mono">Display ({fontFamily.display.join(', ')})</p>
                <p className="font-display text-4xl">Timeless Wooden Furniture</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-2 font-mono">Sans ({fontFamily.sans.join(', ')})</p>
                <p className="font-sans text-xl">Discover a curated collection of premium essentials designed to inspire your everyday.</p>
            </div>
          </div>
        </section>
      </div>
      
      <hr className="my-16" />
      
      <div className="border-4 border-dashed border-gray-300 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="bg-gray-800 text-white text-xs px-3 py-1 absolute top-0 left-0 z-50 rounded-br-lg font-mono">
            /app/page.js Live Render
        </div>
        {/* Render Home directly into the dev container */}
        <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
            <Home />
        </div>
      </div>
    </div>
  );
}
