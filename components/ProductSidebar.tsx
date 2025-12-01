import React from 'react';
import { Product } from '../types';

// Fallback icons
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const CartIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

interface ProductSidebarProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({ product, onClose }) => {
  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
        <p className="text-lg">Select a product from the flyer to view details.</p>
      </div>
    );
  }

  const savings = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">Product Details</h2>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors md:hidden"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Image */}
        <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Brand & Title */}
        <div>
          <p className="text-sm font-bold text-red-600 mb-1 tracking-wide uppercase">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <div className="flex items-center mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-4 h-4 ${star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-red-600">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through decoration-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {savings > 0 && (
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Save {savings}%
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">SKU: {product.sku}</p>
        </div>

        {/* Description */}
        <div className="prose prose-sm text-gray-600">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 flex items-center justify-center space-x-2">
          <CartIcon />
          <span>Add to Cart</span>
        </button>
        <div className="flex gap-2 mt-3">
             <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
               Save for Later
             </button>
             <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
               Share
             </button>
        </div>
      </div>
    </div>
  );
};
