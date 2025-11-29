import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#DA291C] text-white sticky top-0 z-50 shadow-md">
      {/* Top Utility Bar (Mobile/Desktop variation handled via flex) */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-4">
          <div className="bg-[#FFDA00] text-[#DA291C] font-bold p-1 rounded-sm border-2 border-white w-12 h-12 flex items-center justify-center text-2xl tracking-tighter">
            hh
          </div>
          <button className="hidden md:flex flex-col items-center text-xs font-medium hover:opacity-80 transition">
            <span className="text-xl">≡</span>
            <span>Shop All</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 md:mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="What can we help you find?" 
              className="w-full pl-4 pr-10 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#DA291C]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-xs font-medium">
          <div className="hidden lg:flex flex-col items-end">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              Home Hardware - St. Jacobs
            </span>
            <span className="opacity-80">Today's Hours: 8:00am - 5:00pm</span>
          </div>

          <button className="flex flex-col items-center hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden md:inline">Order Status</span>
          </button>

          <button className="flex flex-col items-center hover:opacity-80">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">Log In</span>
          </button>
          
           <button className="flex flex-col items-center hover:opacity-80 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-white text-[#DA291C] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
            <span className="hidden md:inline">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
};
