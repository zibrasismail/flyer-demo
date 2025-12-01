import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FlyerViewer } from './components/FlyerViewer';
import { ProductSidebar } from './components/ProductSidebar';
import { fetchFlyerData, FlyerData } from './services/flyerApi';
import { Product, FlyerPage } from './types';

function App() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlyerData()
      .then(data => {
        setFlyerData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const selectedProduct: Product | null = 
    selectedProductId && flyerData ? flyerData.products[selectedProductId] : null;

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setIsSidebarOpen(true); // Ensure sidebar opens on select (especially for mobile)
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    // We don't necessarily clear selectedProductId on close if we want to keep state when reopening,
    // but for this interaction model, closing usually means "back to full view".
    // However, on desktop with split view, "closing" might not be possible or might just collapse it.
    // If the user strictly wants 80/20, maybe no close button on desktop? 
    // For now, I'll leave the close action behavior as is (hides sidebar).
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading flyer...</div>
      </div>
    );
  }

  if (error || !flyerData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-red-600">Error: {error || 'Failed to load data'}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans text-gray-800">
      <Header />

      {/* Main Content Area: Split View */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Flyer Viewer (Takes ~80% on desktop) */}
        <div className="flex-1 h-full relative transition-all duration-300">
          <FlyerViewer 
            onProductSelect={handleProductSelect} 
            selectedProductId={selectedProductId}
            flyerPage={flyerData.flyerPage}
          />
        </div>

        {/* Right Panel: Product Sidebar (Takes ~20% on desktop) */}
        {/* 
           Desktop: Width is set to w-[20%] or w-[25%] to match "80/20" request.
           Using w-[25%] (1/4) or w-1/5 (20%). Let's use w-[20%] explicitly.
           Mobile: Fixed over content.
        */}
        <div className={`
          fixed md:relative inset-y-0 right-0 z-40
          w-full md:w-[20%] min-w-[250px]
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none border-l border-gray-200 bg-white
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} 
          ${/* Note: Removed md:hidden so it stays visible on desktop even if "closed" logic triggered, or we just handle isSidebarOpen differently. 
              Actually, let's make it toggleable on mobile but persistent on desktop. 
              If I keep 'translate-x-full' it will hide on desktop too. 
              Let's override the translation for desktop if we want it always open? 
              Or just init isSidebarOpen=true and let user close it if they really want?
              The prompt implies it's a structural split. I'll assume it stays open on desktop.
           */ ''}
           ${/* Force open on desktop: override translate for md breakpoint */ 'md:translate-x-0'}
        `}>
             <ProductSidebar 
               product={selectedProduct} 
               onClose={handleCloseSidebar}
             />
        </div>

        {/* Mobile Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={handleCloseSidebar}
            aria-hidden="true"
          />
        )}
        
      </main>
    </div>
  );
}

export default App;
