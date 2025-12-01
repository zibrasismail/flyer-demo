import React, { useState, useRef } from 'react';
import { CURRENT_FLYER_PAGE } from '../constants';
import { detectHotspotsFromImage } from '../utils/hotspotDetection';

interface FlyerViewerProps {
  onProductSelect: (productId: string) => void;
  selectedProductId: string | null;
}

export const FlyerViewer: React.FC<FlyerViewerProps> = ({ onProductSelect, selectedProductId }) => {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [debugCoords, setDebugCoords] = useState<{x: number, y: number} | null>(null);
  const [hotspots, setHotspots] = useState(CURRENT_FLYER_PAGE.hotspots);
  
  const { imageUrl } = CURRENT_FLYER_PAGE;
  const imageRef = useRef<HTMLImageElement>(null);
  const DEBUG_MODE = true; // Toggle this to false when done

  const handleAutoDetect = () => {
    if (imageRef.current) {
      const detected = detectHotspotsFromImage(imageRef.current);
      console.log('Detected Hotspots:', detected);
      
      // Map detected spots to existing products if possible, or just show them as overlay
      // For now, let's replace the visual hotspots with detected ones to test alignment.
      // Since we don't know which product is which, we'll assign temporary IDs or 
      // just loop through mock products to assign them sequentially.
      
      const mappedHotspots = detected.map((spot, index) => {
        // Try to preserve product mapping if count matches, else mock it
        const existing = CURRENT_FLYER_PAGE.hotspots[index];
        return {
            ...spot,
            productId: existing ? existing.productId : `p${index + 1}`
        };
      });
      
      setHotspots(mappedHotspots);
    }
  };

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
    // Debug logic
    if (DEBUG_MODE) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDebugCoords({ x, y });
    }

    // Pan logic
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

      {/* Debug Overlay */}
      {DEBUG_MODE && (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
            {debugCoords && (
              <div className="bg-black bg-opacity-75 text-white p-2 rounded font-mono text-xs">
                X: {debugCoords.x.toFixed(1)}%<br/>
                Y: {debugCoords.y.toFixed(1)}%
              </div>
            )}
            <button 
              onClick={handleAutoDetect}
              className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded shadow"
            >
              Auto Detect Hotspots
            </button>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden flex justify-center items-start p-4 cursor-grab active:cursor-grabbing"
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
                  ${(isHovered || isSelected) 
                    ? 'border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] z-10' 
                    : 'hover:bg-white hover:bg-opacity-10'}
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
