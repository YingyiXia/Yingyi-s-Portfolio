import React from 'react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const linkClass = (view: ViewState) => 
    `cursor-pointer uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:opacity-100 ${
      currentView === view ? 'opacity-100 border-b border-black pb-1' : 'opacity-40 hover:tracking-[0.25em]'
    }`;

  return (
    <nav className="w-full py-12 px-8 md:px-16 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <div 
        className="text-2xl md:text-3xl font-bold tracking-tight cursor-pointer"
        onClick={() => setCurrentView('GALLERY')}
      >
        LUMIÈRE
      </div>
      
      <div className="flex space-x-8 md:space-x-12">
        <div onClick={() => setCurrentView('GALLERY')} className={linkClass('GALLERY')}>
          Work
        </div>
        <div onClick={() => setCurrentView('ABOUT')} className={linkClass('ABOUT')}>
          Profile
        </div>
        <div onClick={() => setCurrentView('UPLOAD')} className={linkClass('UPLOAD')}>
          Upload
        </div>
      </div>
    </nav>
  );
};