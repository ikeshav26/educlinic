'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/gallery/gallery-1.jpg',
    '/gallery/gallery-2.jpg',
    '/gallery/gallery-3.jpg'
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-32 xl:px-58 w-full bg-white flex flex-col">
      <div className="flex flex-col mb-10 text-left">
        <div className="inline-flex items-center justify-center space-x-2 bg-[#fee2e2] text-[#d60000] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide w-fit mb-6 uppercase">
          CAMPUS LIFE
        </div>
        
        <h2 className="text-4xl md:text-[2.75rem] font-bold text-[#111827] leading-[1.1] tracking-tight">
          Gallery Highlights
        </h2>
      </div>

      <div className="relative w-full aspect-[16/10] sm:aspect-video md:aspect-[21/9] rounded-xl overflow-hidden shadow-lg group bg-[#161f36]">
        
        <img 
          src={images[currentIndex]} 
          alt={`Gallery highlight ${currentIndex + 1}`} 
          className="w-full h-full object-cover relative z-0 transition-opacity duration-500" 
        />
        
        <button 
          onClick={handlePrev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="text-white" size={20} strokeWidth={2.5} />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors border border-white/10 z-10"
          aria-label="Next"
        >
          <ChevronRight className="text-white" size={20} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
};

export default Gallery;