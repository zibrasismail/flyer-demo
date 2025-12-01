import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-red-600 text-white shadow-md z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter">HOME HARDWARE</span>
        </div>
        <div className="text-sm font-medium">
          Black Friday Sale | Nov 27 - Dec 3
        </div>
      </div>
    </header>
  );
};
