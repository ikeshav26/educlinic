'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  itemsCount: number;
}

const galleryItems: GalleryItem[] = [
  {
    id: '1',
    src: '/gallery/gallery-5.jpg',
    title: 'IITDAA 1st Executive Meeting held on 23rd May, 2026',
    itemsCount: 61,
  },
  {
    id: '2',
    src: '/gallery/gallery-6.jpg',
    title: 'Farewell to IIT Delhi Alumni Graduating Batch 2026',
    itemsCount: 429,
  },
  {
    id: '3',
    src: '/gallery/gallery-7.jpg',
    title: 'Annual General Meeting 2026',
    itemsCount: 341,
  },
];

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-20 w-full overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32">
        {/* Header Section */}
        <div
          className={`flex justify-between items-center mb-8 transition-all duration-700 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-semibold text-gray-900">Gallery</h2>
          <Link
            href="/gallery"
            className="px-6 py-2 border border-[#a62025] text-[#a62025] hover:bg-[#a62025] hover:text-white rounded font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col gap-3 group cursor-pointer transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[#a62025]/20">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Info */}
              <div className="flex justify-between items-start gap-4 px-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight flex-1 group-hover:text-[#a62025] group-hover:translate-x-1 transition-all duration-300">
                  {item.title}
                </h3>
                <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full group-hover:bg-[#a62025]/10 group-hover:text-[#a62025] transition-all duration-300 whitespace-nowrap mt-0.5">
                  {item.itemsCount} Items
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
