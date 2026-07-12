'use client';
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
}

interface ListEventProps {
  id: string;
  month: string;
  day: string;
  title: string;
  location: string;
  type: 'upcoming' | 'past';
}

const featuredEvents: EventCardProps[] = [
  {
    id: '1',
    image: '/gallery/gallery-5.jpg',
    title: 'Invitation: IIT Delhi Alumni Greater Noida Mixer',
    date: 'Jul 30, 2026 - 05:30 PM',
  },
  {
    id: '2',
    image: '/gallery/gallery-6.jpg',
    title: 'Save the Date: Convocation 2026 || ...',
    date: 'Aug 08, 2026',
  }
];

const listEvents: ListEventProps[] = [
  { id: '10', month: 'Jul', day: '30', title: 'IIT Delhi Alumni Greater Noida Mixer', location: 'Noida', type: 'upcoming' },
  { id: '11', month: 'Aug', day: '08', title: 'Convocation 2026', location: 'Campus', type: 'upcoming' },
  { id: '12', month: 'Aug', day: '15', title: 'HYFIT Games — Run. Lift. Live', location: 'Delhi', type: 'upcoming' },
  { id: '13', month: 'Sep', day: '02', title: 'Startup Networking Night', location: 'Gurugram', type: 'upcoming' },
  { id: '14', month: 'Jan', day: '15', title: 'Alumni Meet 2025', location: 'Virtual', type: 'past' },
  { id: '15', month: 'Dec', day: '20', title: 'Winter Gala Dinner', location: 'Delhi', type: 'past' },
];

export function UpcomingEvents() {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [page, setPage] = useState(1);

  const filteredEvents = listEvents.filter(e => e.type === filter);
  // Paginate 4 per page
  const displayedList = filteredEvents.slice((page - 1) * 4, page * 4);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / 4));

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <section className="bg-white py-12 md:py-20 w-full">
      <div className="mx-auto max-w-[90rem] px-4 md:px-8 lg:px-16 xl:px-32">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">Events</h2>
          <Link
            href="/events"
            className="px-6 py-2 border border-[#a62025] text-[#a62025] hover:bg-[#a62025] hover:text-white rounded font-medium transition-colors cursor-pointer"
          >
            View All
          </Link>
        </div>

        {/* 30/70 Layout Grid */}
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
              {displayedList.map(event => (
                <div key={event.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 cursor-pointer transition-all group">
                  {/* Date Icon */}
                  <div className="flex flex-col items-center justify-center min-w-[55px] py-1.5 bg-gray-50 border border-gray-100 rounded-md group-hover:border-[#a62025]/30 group-hover:bg-[#a62025]/5 transition-colors">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{event.month}</span>
                    <span className="text-xl font-bold text-[#a62025] leading-none mt-1">{event.day}</span>
                  </div>
                  {/* Event Details */}
                  <div className="flex flex-col gap-1 mt-0.5">
                    <h4 className="text-[15px] font-medium text-gray-800 leading-snug group-hover:text-[#a62025] transition-colors line-clamp-2">
                      {event.title}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={12}/> {event.location}
                    </span>
                  </div>
                </div>
              ))}
              
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

          {/* Right Area (70%) - Featured Event Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 h-full">
              {featuredEvents.map((event) => (
                <article
                  key={event.id}
                  className="group flex flex-col overflow-hidden bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden bg-white">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Box */}
                  <div className="flex flex-col flex-1 p-5 lg:p-6 gap-3 bg-white">
                    <h3 className="font-medium text-gray-800 text-[15px] line-clamp-1 mb-1">
                      {event.title}
                    </h3>
                    
                    <div>
                      <span className="inline-block bg-[#85161a] text-white text-[11px] font-medium px-3 py-1 rounded-full">
                        Upcoming Event
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mt-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{event.date}</span>
                    </div>
                    
                    <div className="mt-5">
                      <Link
                        href="/events"
                        className="inline-block bg-[#85161a] text-white text-xs font-medium px-5 py-2 hover:bg-[#6c1215] transition-colors rounded-sm"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
