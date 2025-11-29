import React, { useState } from 'react';
import { Header } from './components/Header';
import { FlyerViewer } from './components/FlyerViewer';
import { ProductSidebar } from './components/ProductSidebar';
import { MOCK_PRODUCTS } from './constants';
import { Product } from './types';

function App() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive the actual product object from ID
  const selectedProduct: Product | null = selectedProductId ? MOCK_PRODUCTS[selectedProductId] : null;

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProductId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans text-gray-800">
      <Header />

      {/* Main Content Area: Split View */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Flyer Viewer */}
        {/* Logic: On desktop, if sidebar is open, take up remaining space (approx 75-80%). If closed, 100%. */}
        <div className="flex-1 h-full relative transition-all duration-300">
          <FlyerViewer 
            onProductSelect={handleProductSelect} 
            selectedProductId={selectedProductId}
          />
        </div>

        {/* Right Panel: Product Sidebar */}
        {/* 
           Desktop: Width is strictly controlled to be ~20-25% (w-80 or w-96 usually fits this). 
           Mobile: Slide over.
        */}
        <div className={`
          fixed md:relative inset-y-0 right-0 z-40
          w-full md:w-[25%] lg:w-[22%] 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none border-l border-gray-200 bg-white
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:hidden'}
        `}>
          {isSidebarOpen ? (
             <ProductSidebar 
               product={selectedProduct} 
               onClose={handleCloseSidebar}
             />
          ) : (
            // Placeholder when sidebar is "hidden" on desktop layout but we want to maintain structure if needed, 
            // OR strictly hidden. The user prompt asked for "Open right side", implying it might be closed initially.
            // However, typical flyer apps often keep the sidebar closed until clicked.
            // Implementation: We keep the sidebar rendering conditional on 'isSidebarOpen' for mobile, 
            // but for desktop, we might want it to collapse completely if nothing selected.
            // Current CSS logic above hides it via `md:hidden` if !isSidebarOpen.
            // To make it behave like 80/20 split ONLY when active:
            null
          )}
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
