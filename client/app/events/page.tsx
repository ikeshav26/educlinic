import React from 'react';
import { ArrowRight, MapPin, CalendarX } from 'lucide-react';
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
    <div className="w-full bg-[#faf8f3] text-[#231f1b] min-h-screen font-sans">
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 xl:px-20 w-full max-w-[90rem] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col mb-12 md:mb-16">
          <p className="text-sm font-semibold tracking-[0.15em] text-[#a62025] uppercase mb-2">
            Stay Connected
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight tracking-tight mb-4">
            Come back home. Or join from anywhere.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Discover and register for the latest workshops, reunions, and professional gatherings. Reconnect with peers and expand your BFCET network.
          </p>
        </div>

        {events.length === 0 ? (
          /* Professional Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <CalendarX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No events scheduled</h3>
            <p className="text-gray-500 max-w-sm">
              We are currently planning new events. Check back later for updates and registrations.
            </p>
          </div>
        ) : (
          /* Event Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const { month, day, year } = formatDate(event.startDate);
              return (
                <article
                  key={event.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md h-full"
                >
                  {/* Date/Header Strip */}
                  <div className="flex items-center gap-4 bg-[#182236] px-6 py-4 text-white">
                    <div className="text-center leading-none">
                      <span className="block text-xs font-semibold tracking-widest text-[#a62025] uppercase">
                        {month}
                      </span>
                      <span className="mt-1 block font-serif text-3xl font-bold">
                        {day}
                      </span>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                      <span className="inline-flex bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {event.eventType}
                      </span>
                      <p className="mt-1.5 text-xs text-gray-400">
                        {year} &middot; By {event.organizedBy}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col gap-3 p-6 bg-white">
                    <h3 className="font-serif text-xl font-bold leading-snug text-gray-900 group-hover:text-[#a62025] transition-colors">
                      {event.name}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {event.description || 'No detailed description provided for this event.'}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="size-4 text-[#a62025]" aria-hidden="true" />
                      {event.place}
                    </p>
                    <Link
                      href="#"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#a62025] hover:text-[#85161a]"
                    >
                      Register Now
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}