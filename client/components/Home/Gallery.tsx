import React from 'react';
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
    src: '/gallery/gallery-1.jpg',
    title: 'IITDAA 1st Executive Meeting held on 23rd May, 2026',
    itemsCount: 61,
  },
  {
    id: '2',
    src: '/gallery/gallery-2.jpg',
    title: 'Farewell to IIT Delhi Alumni Graduating Batch 2026',
    itemsCount: 429,
  },
  {
    id: '3',
    src: '/gallery/gallery-3.jpg',
    title: 'Annual General Meeting 2026',
    itemsCount: 341,
  },
];

const Gallery = () => {
  return (
    <section className="bg-white py-12 md:py-20 w-full">
      <div className="mx-auto max-w-[90rem] px-4 md:px-8 lg:px-16 xl:px-32">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Gallery</h2>
          <Link
            href="/gallery"
            className="px-6 py-2 border border-[#a62025] text-[#a62025] hover:bg-[#a62025] hover:text-white rounded font-medium transition-colors cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 group cursor-pointer">
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text Info */}
              <div className="flex justify-between items-start gap-4 px-1">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight flex-1 group-hover:text-[#a62025] transition-colors">
                  {item.title}
                </h3>
                <span className="text-gray-600 text-sm whitespace-nowrap mt-0.5">
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
