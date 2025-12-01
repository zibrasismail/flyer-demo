import React, { useState, useRef } from 'react';
import { FlyerPage } from '../types';

interface FlyerViewerProps {
  onProductSelect: (productId: string) => void;
  selectedProductId: string | null;
  flyerPage: FlyerPage;
}

export const FlyerViewer: React.FC<FlyerViewerProps> = ({ onProductSelect, selectedProductId, flyerPage }) => {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  
  const { imageUrl, hotspots } = flyerPage;
  const imageRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 4);
      setScale(newScale);
    } else {
      // Pan (if zoomed) - optional, or let browser scroll natural if not zoomed
      // For this implementation, let's strictly use drag for pan to avoid scrolling conflicts
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 }); // Reset pos on reset zoom
      return newScale;
    });
  };

  return (
    <div className="w-full h-full bg-gray-800 overflow-hidden flex flex-col relative">
      {/* Controls Toolbar */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="bg-white text-gray-800 p-2 rounded shadow hover:bg-gray-100" aria-label="Zoom In">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
        <button onClick={handleZoomOut} className="bg-white text-gray-800 p-2 rounded shadow hover:bg-gray-100" aria-label="Zoom Out">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        </button>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-start p-4 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="relative shadow-2xl inline-block bg-white transition-transform duration-100 ease-out origin-top-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            maxWidth: '100%'
          }}
        >
          {/* Catalogue Image */}
          <img 
            ref={imageRef}
            src={imageUrl} 
            alt="Catalogue Page" 
            className="block select-none pointer-events-none max-w-full h-auto"
            crossOrigin="anonymous"
            draggable={false}
          />

        {/* Hotspot Overlay Layer */}
        <div className="absolute inset-0">
          {hotspots.map((hotspot) => {
            const isSelected = selectedProductId === hotspot.productId;
            const isHovered = hoveredHotspotId === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className={`absolute transition-all duration-200 
                  ${isHovered 
                    ? 'border-2 border-red-600 bg-black bg-opacity-10 z-10' 
                    : isSelected
                      ? 'border-2 border-blue-600 z-10'
                      : 'hover:border-2 hover:border-red-600 hover:bg-black hover:bg-opacity-10'}
                `}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                onMouseLeave={() => setHoveredHotspotId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onProductSelect(hotspot.productId);
                }}
                title="Click to view details"
                role="button"
                aria-label={`View details for product`}
              />
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
};
