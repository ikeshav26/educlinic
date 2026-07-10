import React from 'react';
import { ArrowRight, MapPin, Users, CalendarX } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

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

const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await axios.get('http://localhost:4000/api/events/all-events');
    return res.data.events || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return { month, day, year };
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="w-full bg-black/5 min-h-screen font-sans">
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 xl:px-20 w-full max-w-[90rem] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            Upcoming Events
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Discover and register for the latest workshops, reunions, and professional gatherings.
          </p>
        </div>

        {events.length === 0 ? (
          /* Professional Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <CalendarX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">No events scheduled</h3>
            <p className="text-gray-500 max-w-sm">
              We are currently planning new events. Check back later for updates and registrations.
            </p>
          </div>
        ) : (
          /* Event Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {events.map((event) => {
              const { month, day, year } = formatDate(event.startDate);
              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 flex flex-col transition-all hover:-translate-y-1.5 duration-300 h-full"
                >
                  {/* Date Header Strip */}
                  <div className="bg-[#161f36] relative flex justify-between items-center py-4 px-6 shrink-0 border-b-4 border-[#d60000]">
                    <div className="flex items-baseline space-x-2 z-10">
                      <span className="text-3xl font-black text-white tracking-tighter">
                        {day}
                      </span>
                      <span className="text-[#eab308] text-sm font-bold tracking-widest">
                        {month}
                      </span>
                    </div>
                    <span className="text-gray-300 text-sm font-medium z-10">
                      {year}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow relative bg-white">
                    {/* Event Tag */}
                    <div className="mb-4">
                      <span className="inline-flex bg-[#fee2e2] text-[#d60000] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#fecaca]">
                        {event.eventType}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-grow mb-6">
                      <h3 className="font-bold text-[#111827] group-hover:text-[#d60000] transition-colors text-xl mb-3 leading-snug">
                        {event.name}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                        {event.description || 'No detailed description provided for this event.'}
                      </p>
                    </div>

                    {/* Meta Information (Organizer & Location) */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={16} className="text-gray-400 shrink-0 mr-3" />
                        <span className="truncate font-medium">By {event.organizedBy}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="text-[#d60000] shrink-0 mr-3" />
                        <span className="truncate">{event.place}</span>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-5 border-t border-gray-100 mt-auto flex justify-end">
                      <Link
                        href="#"
                        className="inline-flex items-center space-x-2 text-[#111827] font-bold text-sm hover:text-[#d60000] transition-colors"
                      >
                        <span>Register Now</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}