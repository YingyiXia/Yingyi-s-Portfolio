import React, { useState } from 'react';
import { Photo } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onRemove: (id: string) => void;
}

interface PhotoCardProps {
  photo: Photo;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onRemove: (id: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, hoveredId, setHoveredId, onRemove }) => (
  <div 
    className="relative mb-8 group break-inside-avoid"
    onMouseEnter={() => setHoveredId(photo.id)}
    onMouseLeave={() => setHoveredId(null)}
  >
    <div className="overflow-hidden bg-gray-50">
      <img 
        src={photo.url} 
        alt={photo.title}
        className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02] grayscale hover:grayscale-0"
        loading="lazy"
      />
    </div>
    
    <div className={`mt-3 transition-opacity duration-500 ${hoveredId === photo.id ? 'opacity-100' : 'opacity-0 md:opacity-60'}`}>
      <h3 className="text-lg italic">{photo.title}</h3>
      {photo.description && (
        <p className="text-xs text-gray-500 font-sans tracking-wide mt-1 uppercase max-w-[80%]">
          {photo.description}
        </p>
      )}
    </div>

    {hoveredId === photo.id && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(photo.id);
        }}
        className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black p-2 w-8 h-8 flex items-center justify-center transition-colors font-sans text-xs"
        title="Remove"
      >
        ✕
      </button>
    )}
  </div>
);

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onRemove }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (photos.length === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col justify-center items-center opacity-40">
        <p className="text-xl italic font-serif">Empty Space</p>
        <p className="text-sm mt-2 font-sans uppercase tracking-widest">Upload your first masterpiece</p>
      </div>
    );
  }

  // Simple column distribution for masonry effect
  const columns = {
    left: photos.filter((_, i) => i % 2 === 0),
    right: photos.filter((_, i) => i % 2 !== 0),
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pb-24">
      {/* Mobile View: Single Column */}
      <div className="block md:hidden">
         {photos.map(photo => (
           <PhotoCard 
             key={photo.id} 
             photo={photo} 
             hoveredId={hoveredId} 
             setHoveredId={setHoveredId} 
             onRemove={onRemove} 
           />
         ))}
      </div>

      {/* Desktop View: Two Columns Masonry */}
      <div className="hidden md:flex gap-8 items-start">
        <div className="flex-1">
          {columns.left.map(photo => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              hoveredId={hoveredId} 
              setHoveredId={setHoveredId} 
              onRemove={onRemove} 
            />
          ))}
        </div>
        <div className="flex-1 mt-16">
          {columns.right.map(photo => (
            <PhotoCard 
              key={photo.id} 
              photo={photo} 
              hoveredId={hoveredId} 
              setHoveredId={setHoveredId} 
              onRemove={onRemove} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};