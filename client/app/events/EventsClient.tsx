'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, CalendarX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Event {
  id: number;
  name: string;
  description: string | null;
  organizedBy: string;
  place: string;
  eventType: string;
  visibility: string;
  startDate: string;
  endDate: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  // Format time (e.g. 05:30 PM)
  const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: true });

  return { month, day, year, time, fullDate: `${month} ${day}, ${year} - ${time}` };
};

export default function EventsClient({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const now = new Date();
  
  // Classify events
  const categorizedEvents = events.map(e => ({
    ...e,
    type: new Date(e.startDate) >= now ? 'upcoming' : 'past'
  }));

  const filteredEvents = categorizedEvents.filter(e => e.type === filter);
  
  const ITEMS_PER_PAGE = 4;
  const displayedList = filteredEvents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  const placeholderImages = [
    '/gallery/gallery-1.jpg',
    '/gallery/gallery-2.jpg',
    '/gallery/gallery-3.jpg',
    '/gallery/gallery-4.jpg',
  ];

  if (!mounted) return null;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <CalendarX size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No events scheduled</h3>
        <p className="text-gray-500 max-w-sm">
          We are currently planning new events. Check back later for updates and registrations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
      {/* Left Sidebar (30%) - Calendar & Filters */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Filter Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-md max-w-fit border border-gray-100">
          <button
            onClick={() => { setFilter('upcoming'); setPage(1); }}
            className={`px-5 py-2 rounded text-sm font-medium transition-all ${filter === 'upcoming' ? 'bg-white shadow-sm text-[#a62025]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => { setFilter('past'); setPage(1); }}
            className={`px-5 py-2 rounded text-sm font-medium transition-all ${filter === 'past' ? 'bg-white shadow-sm text-[#a62025]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Past
          </button>
        </div>

        {/* Calendar List View */}
        <div className="flex flex-col gap-2 min-h-[300px]">
          {displayedList.map(event => {
            const { month, day } = formatDate(event.startDate);
            return (
              <div key={event.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all group">
                <div className="flex flex-col items-center justify-center min-w-[55px] py-1.5 bg-gray-50 border border-gray-100 rounded-md group-hover:border-[#a62025]/30 group-hover:bg-[#a62025]/5 transition-colors">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{month}</span>
                  <span className="text-xl font-bold text-[#a62025] leading-none mt-1">{day}</span>
                </div>
                <div className="flex flex-col gap-1 mt-0.5">
                  <h4 className="text-[15px] font-medium text-gray-800 leading-snug group-hover:text-[#a62025] transition-colors line-clamp-2">
                    {event.name}
                  </h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12}/> {event.place}
                  </span>
                </div>
              </div>
            );
          })}

          {displayedList.length === 0 && (
            <p className="text-sm text-gray-500 italic p-4 text-center">No {filter} events found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-5">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="p-1 text-gray-400 hover:text-[#a62025] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
            >
              <ChevronLeft size={22}/>
            </button>
            <span className="text-xs font-medium text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="p-1 text-gray-400 hover:text-[#a62025] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors cursor-pointer"
            >
              <ChevronRight size={22}/>
            </button>
          </div>
        )}
      </div>

      {/* Right Area (70%) - Event Cards */}
      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 h-full items-start">
          {displayedList.map((event, index) => {
            const { fullDate } = formatDate(event.startDate);
            const image = placeholderImages[index % placeholderImages.length];
            return (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow border border-gray-100 h-full"
              >
                <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={image}
                    alt={event.name}
                    fill
                    className="object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-5 lg:p-6 gap-3 bg-white">
                  <h3 className="font-medium text-gray-800 text-[15px] line-clamp-1 mb-1">
                    {event.name}
                  </h3>
                  <div>
                    <span className="inline-block bg-[#85161a] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                      {event.eventType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-1">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{fullDate}</span>
                  </div>
                  <div className="mt-5 mt-auto">
                    <Link
                      href="#"
                      className="inline-block bg-[#85161a] text-white text-xs font-medium px-5 py-2 hover:bg-[#6c1215] transition-colors rounded-sm"
                    >
                      View Event
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
