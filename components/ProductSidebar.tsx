import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { generateProductInsight } from '../services/geminiService';

interface ProductSidebarProps {
  product: Product | null;
  onClose: () => void; // For mobile close behavior
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({ product, onClose }) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Fetch AI insight when product changes
  useEffect(() => {
    setAiInsight('');
    if (product) {
      // Small debounce/delay to simulate analysis or wait for user to settle
      const timer = setTimeout(async () => {
        setIsLoadingAi(true);
        const text = await generateProductInsight(product);
        setAiInsight(text);
        setIsLoadingAi(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-white">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="text-lg font-semibold">No Product Selected</h3>
        <p className="text-sm mt-2">Select a highlighted area on the flyer to view product details.</p>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="h-full bg-white flex flex-col shadow-xl relative animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Details</span>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-black">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6">
        
        {/* Product Image */}
        <div className="w-full aspect-square bg-white border rounded-lg p-4 mb-6 flex items-center justify-center relative group">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          {discountPercentage > 0 && (
             <div className="absolute top-2 right-2 bg-[#DA291C] text-white text-xs font-bold px-2 py-1 rounded">
               SAVE {discountPercentage}%
             </div>
          )}
        </div>

        {/* Brand & Title */}
        <div className="mb-4">
          <h4 className="text-sm text-gray-500 font-medium uppercase">{product.brand}</h4>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mt-1">{product.name}</h2>
          <div className="text-xs text-gray-400 mt-1">Item #{product.sku}</div>
        </div>

        {/* Price Block */}
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#DA291C]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                Was ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-[#DA291C] font-semibold mt-1">
            Valid Nov 27th - Dec 3rd 2025
          </div>
        </div>

        {/* Gemini AI Insight Section */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4V7a1 1 0 0 0-1-1z"/></svg>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Smart Insight</span>
            </div>
            {isLoadingAi ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-2 bg-blue-200 rounded w-full"></div>
                </div>
            ) : (
                <p className="text-sm text-blue-900 italic leading-relaxed">
                    "{aiInsight || 'Ask our smart assistant for details...'}"
                </p>
            )}
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-sm font-bold border-b-2 border-[#DA291C] inline-block mb-3 pb-1">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-white border-t sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button className="flex-1 bg-[#DA291C] hover:bg-red-700 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
          <button className="flex-1 bg-white border-2 border-[#DA291C] text-[#DA291C] font-bold py-3 rounded-full hover:bg-red-50 transition-colors">
            Product Details
          </button>
        </div>
      </div>
    </div>
  );
};
