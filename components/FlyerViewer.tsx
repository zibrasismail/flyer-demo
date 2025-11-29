import React from 'react';
import { MOCK_PRODUCTS } from '../constants';

interface FlyerViewerProps {
  onProductSelect: (productId: string) => void;
  selectedProductId: string | null;
}

export const FlyerViewer: React.FC<FlyerViewerProps> = ({ onProductSelect, selectedProductId }) => {
  
  // Helper to render a product card within the flyer
  const renderProductCard = (productId: string, customClasses: string) => {
    const product = MOCK_PRODUCTS[productId];
    if (!product) return null;

    const isSelected = selectedProductId === productId;
    const saveAmount = product.originalPrice ? Math.round(product.originalPrice - product.price) : 0;
    const savePercent = product.originalPrice ? Math.round((saveAmount / product.originalPrice) * 100) : 0;

    return (
      <div 
        onClick={() => onProductSelect(productId)}
        className={`
          relative group cursor-pointer transition-all duration-200 border-2
          ${isSelected ? 'border-black ring-4 ring-yellow-400 z-20 scale-[1.02] shadow-2xl' : 'border-transparent hover:border-black/20 hover:shadow-lg'}
          ${customClasses}
        `}
      >
        {/* Hover "Shape" Effect */}
        <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-200`} />

        <div className="h-full flex flex-col p-2 md:p-4">
          {/* Discount Badge */}
          <div className="mb-2">
            <h3 className="text-[#DA291C] font-black text-xl md:text-3xl uppercase leading-none">
              Save {saveAmount > 100 ? `$${saveAmount}` : `${savePercent}%`}
            </h3>
            <p className="text-black font-bold text-xs md:text-sm uppercase">{product.name}</p>
          </div>

          {/* Product Image */}
          <div className="flex-1 relative flex items-center justify-center min-h-[120px]">
             <img 
               src={product.imageUrl} 
               alt={product.name} 
               className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
             />
          </div>

          {/* Price Tag */}
          <div className="mt-2">
             <div className="text-xs text-gray-500 line-through font-medium">Was ${product.originalPrice?.toFixed(2)}</div>
             <div className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none">
               <span className="text-2xl align-top">$</span>
               {Math.floor(product.price)}
               <span className="text-2xl align-top underline decoration-2">{Math.round((product.price % 1) * 100)}</span>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-gray-200 overflow-y-auto overflow-x-hidden flex justify-center p-4">
      {/* Flyer Paper Container */}
      <div className="w-full max-w-[1000px] bg-[#FFF200] shadow-2xl min-h-[1200px] flex flex-col origin-top">
        
        {/* Header Section */}
        <div className="bg-[#1A1A1A] p-6 text-center relative overflow-hidden">
          {/* Decorative bursts */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-red-500 to-transparent animate-pulse" />
          
          <h2 className="text-white text-sm md:text-base font-bold uppercase tracking-widest mb-2 relative z-10">
            Locally Owned. Genuinely Canadian.
          </h2>
          <div className="relative z-10 inline-block">
             <div className="bg-[#DA291C] text-white p-2 rounded-lg inline-block mr-4 align-middle border-2 border-white transform -rotate-6">
                <span className="font-bold text-2xl border-2 border-white p-1 block">hh</span>
             </div>
             <div className="inline-block text-left align-middle">
               <h1 className="text-white font-black text-5xl md:text-7xl leading-none tracking-tighter italic">
                 BLACK <br/>
                 <span className="text-[#FFF200] drop-shadow-[2px_2px_0px_rgba(218,41,28,1)]">FRIDAY</span> <br/>
                 SALE
               </h1>
             </div>
          </div>
          <div className="mt-2 text-white text-xs font-medium relative z-10">
            SAVINGS AVAILABLE NOVEMBER 27 - DECEMBER 3, 2025
          </div>
        </div>

        {/* Grid Layout Section */}
        {/* Corresponds to the layout: Tree (Left), Tools/BBQ (Center), Vacuum/Cookie (Right) */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-12 gap-0.5 bg-black">
          
          {/* Left Column (Tree) - Spans 2 rows on desktop */}
          <div className="md:col-span-4 bg-[#FFF200] h-full">
            {renderProductCard('p1', 'h-full')}
          </div>

          {/* Middle & Right Columns Container */}
          <div className="md:col-span-8 grid grid-cols-2 gap-0.5 bg-black h-full">
            
            {/* Top Row: Tools & Vacuum */}
            <div className="bg-[#FFF200] aspect-[3/4]">
               {renderProductCard('p2', 'h-full')}
            </div>
            <div className="bg-[#FFF200] aspect-[3/4]">
               {renderProductCard('p3', 'h-full')}
            </div>

            {/* Bottom Row: BBQ & Cookie Sheet */}
            <div className="bg-[#FFF200] aspect-[3/4]">
               {renderProductCard('p5', 'h-full')}
            </div>
            <div className="bg-[#FFF200] aspect-[3/4]">
               {renderProductCard('p4', 'h-full')}
            </div>

          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-black text-[#FFF200] p-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest">Door Crasher Specials!</h2>
        </div>

      </div>
    </div>
  );
};
