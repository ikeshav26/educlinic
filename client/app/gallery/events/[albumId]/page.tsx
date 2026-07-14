import React from 'react';
import Image from 'next/image';
import { albums } from '../data';
import LightboxGallery from '@/components/Gallery/LightboxGallery';
import { notFound } from 'next/navigation';

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const album = albums.find(a => a.id === albumId);

  if (!album) {
    notFound();
  }

  const images = Array.from({ length: album.count }, (_, i) => `/gallery/events/${album.id}/${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative w-full h-[250px] md:h-[350px] bg-gray-900 overflow-hidden">
        <Image
          src="/gallery-images/17.jpg"
          alt="Events Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center container mx-auto px-4 md:px-8 max-w-7xl">
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">

          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-8 leading-snug font-sans">
            {album.title}
          </h2>

          <LightboxGallery images={images} />
        </div>
      </section>
    </div>
  );
}
