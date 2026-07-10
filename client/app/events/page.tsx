import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
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

    console.log(res.data)
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
    <div className="w-full bg-black/5 min-h-screen">
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-32 xl:px-58 w-full max-w-7xl mx-auto">
        <div className="flex flex-col mb-14">
          <h1 className="text-4xl md:text-[2.75rem] font-bold text-[#111827] leading-[1.1] tracking-tight mb-4">
            All Events
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
            Discover and register for all upcoming events, workshops, and reunions.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-lg">
            No events found. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const { month, day, year } = formatDate(event.startDate);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col transition-transform hover:-translate-y-1 duration-300 h-full"
                >
                  <div className="bg-[#161f36] text-white flex flex-row justify-center items-center py-4 px-6 shrink-0 space-x-4">
                    <span className="text-[#eab308] text-sm font-bold tracking-wider">
                      {month}
                    </span>
                    <span className="text-3xl font-extrabold">
                      {day}
                    </span>
                    <span className="text-gray-400 text-sm">{year}</span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative bg-white">
                    <div className="flex justify-between items-start w-full mb-4">
                      <span className="bg-[#fee2e2] text-[#d60000] text-xs font-semibold px-4 py-1.5 rounded-full capitalize">
                        {event.eventType.toLowerCase()}
                      </span>
                      <div className="w-2.5 h-2.5 bg-[#d60000] rounded-full mt-2" />
                    </div>

                    <div className="flex-grow mb-8">
                      <h3 className="font-bold text-[#111827] text-xl mb-3 leading-tight">
                        {event.name}
                      </h3>
                      <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3">
                        {event.description || 'No description provided.'}
                      </p>
                    </div>

                    <hr className="border-gray-200 mb-5" />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 mt-auto">
                      <div className="flex items-center text-gray-500 text-xs font-medium space-x-2">
                        <MapPin size={16} className="text-[#d60000] shrink-0" />
                        <span className="text-gray-500 line-clamp-1">{event.place}</span>
                      </div>

                      <Link
                        href="#"
                        className="flex items-center space-x-1.5 text-[#111827] font-bold text-sm hover:text-[#d60000] transition-colors group shrink-0"
                      >
                        <span>Register Now</span>
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
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
