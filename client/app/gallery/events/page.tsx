import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { albums } from './data';

export default function EventsGallery() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[250px] md:h-[350px] bg-gray-900 overflow-hidden">
        <Image
          src="/gallery-images/17.jpg"
          alt="Events Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center container mx-auto px-4 md:px-8 max-w-7xl"></div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex flex-col sm:flex-row bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full group"
              >
                <div className="relative w-full sm:w-1/3 min-h-[220px] sm:min-h-full overflow-hidden">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-between w-full sm:w-2/3 relative">
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1e293b] sm:pr-8 mb-4 leading-snug">
                      {album.title}
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <Calendar size={18} />
                        <span>{album.count} Photos in this Gallery</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/gallery/events/${album.id}`}
                      className="bg-[#b91c1c] hover:bg-[#991b1b] cursor-pointer text-white px-8 py-2.5 rounded font-semibold text-sm transition-colors shadow-sm inline-block"
                    >
                      View Album
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
