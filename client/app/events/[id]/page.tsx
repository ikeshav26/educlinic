'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, Users, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Event {
  id: number;
  name: string;
  description: string | null;
  organizedBy: string;
  place: string;
  imageUrl?: string | null;
  eventType: string;
  visibility: string;
  startDate: string;
  endDate: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: true });
  return {
    fullDate: date.toLocaleDateString('en-US', options),
    time
  };
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const placeholderImages = [
    '/gallery/gallery-5.jpg',
    '/gallery/gallery-6.jpg',
    '/gallery/gallery-7.jpg',
  ];

  // Beautiful fallbacks for offline development, local runs, or unauthenticated users
  const dummyEvents: Record<string, Partial<Event>> = {
    "1": {
      name: "IITDAA 1st Executive Meeting held on 23rd May, 2026",
      description: "First executive committee meeting of IIT Delhi Alumni Association. Discussing roadmap and upcoming events.",
      organizedBy: "IITD Alumni Association",
      place: "Seminar Hall, IIT Delhi Campus",
      eventType: "OFFLINE",
      visibility: "GLOBAL",
      startDate: "2026-05-23T10:00:00.000Z",
      endDate: "2026-05-23T16:00:00.000Z",
    },
    "2": {
      name: "Farewell to IIT Delhi Alumni Graduating Batch 2026",
      description: "Celebrating the achievements and bidding farewell to the graduating batch of 2026. Join us for a night of memories and networking.",
      organizedBy: "IIT Delhi Alumni Relations",
      place: "Convocation Hall, Main Campus",
      eventType: "OFFLINE",
      visibility: "GLOBAL",
      startDate: "2026-06-15T18:00:00.000Z",
      endDate: "2026-06-15T22:00:00.000Z",
    },
    "3": {
      name: "Annual General Meeting 2026",
      description: "The Annual General Meeting for all members to discuss progress, financial reports, and future plans.",
      organizedBy: "IITDAA",
      place: "Virtual Meeting via Zoom",
      eventType: "ONLINE",
      visibility: "GLOBAL",
      startDate: "2026-07-20T14:00:00.000Z",
      endDate: "2026-07-20T17:00:00.000Z",
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/events/${id}`, {
          withCredentials: true,
        });
        setEvent(res.data.event);
      } catch (err) {
        console.warn('Could not fetch event from server, using fallback data:', err);
        // Load fallback dummy data if unauthenticated or offline
        const eventIdStr = id as string;
        const fallback: Event = {
          id: Number(id),
          name: dummyEvents[eventIdStr]?.name || `Special Alumni Event #${id}`,
          description: dummyEvents[eventIdStr]?.description || "This exclusive event is organized to reconnect alumni, share insights, and discuss future opportunities. Join us to build stronger networks, participate in panel discussions, and collaborate on new initiatives.",
          organizedBy: dummyEvents[eventIdStr]?.organizedBy || "BFCET Alumni Association",
          place: dummyEvents[eventIdStr]?.place || "Main Auditorium, BFCET Campus",
          eventType: dummyEvents[eventIdStr]?.eventType || "OFFLINE",
          visibility: dummyEvents[eventIdStr]?.visibility || "GLOBAL",
          startDate: dummyEvents[eventIdStr]?.startDate || new Date().toISOString(),
          endDate: dummyEvents[eventIdStr]?.endDate || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        };
        setEvent(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#a62025]/30 border-t-[#a62025] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Not Found</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            The event you are looking for does not exist or may have been removed.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-[#a62025] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#85161a] transition-colors"
          >
            <ArrowLeft size={18} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const { fullDate: startFull, time: startTime } = formatDate(event.startDate);
  const { fullDate: endFull, time: endTime } = formatDate(event.endDate);

  const isBadUrl = event.imageUrl?.includes('unsplash.com/photos/');
  const eventImage = (event.imageUrl && !isBadUrl)
    ? event.imageUrl
    : placeholderImages[event.id % placeholderImages.length];

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans pb-16 md:pb-24">
      {/* Top Banner and Image Hero */}
      <div className="relative w-full h-[35vh] md:h-[50vh] bg-black overflow-hidden">
        {/* Blurred background image for luxury effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-105"
          style={{ backgroundImage: `url(${eventImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/30 z-10" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 md:left-12 z-20">
          <Link 
            href="/events"
            className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-black/60 transition-all font-medium text-sm"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-24 md:-mt-36 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image and Main Details (65%) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
            {/* Aspect Ratio Image Container */}
            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-gray-100 border-b border-gray-100">
              <Image 
                src={eventImage} 
                alt={event.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Event Description and Content */}
            <div className="p-6 md:p-10">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1 bg-[#a62025]/10 text-[#a62025] text-xs font-semibold px-3 py-1 rounded-full border border-[#a62025]/10">
                  <Tag size={12} /> {event.eventType}
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">
                  <Users size={12} /> {event.visibility}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                {event.name}
              </h1>

              {/* Mobile Info Cards (Visible only on mobile/tablet) */}
              <div className="lg:hidden flex flex-col gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200/60 mb-8">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#a62025]/10 rounded-lg text-[#a62025] mt-0.5">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Date & Time</h4>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{startFull}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{startTime} onwards</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-[#a62025]/10 rounded-lg text-[#a62025] mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Location</h4>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{event.place}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {event.description || "No description provided for this event."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Info Sidebar & Actions (35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
            {/* Quick Details Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 hidden lg:flex flex-col gap-6">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Event Details</h3>

              {/* Organizer */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Organized By</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{event.organizedBy}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Date</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{startFull}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Time</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{startTime} - {endTime}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Location</h4>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug">{event.place}</p>
                </div>
              </div>
            </div>

            {/* Action Box */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500 font-medium">Registration status</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Open
                </span>
              </div>
              <button
                className="w-full bg-[#a62025] hover:bg-[#85161a] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-[#a62025]/10 text-center cursor-pointer text-sm"
                onClick={() => alert("Event registration is coming soon!")}
              >
                Join Event
              </button>
              <p className="text-[11px] text-gray-400 text-center leading-normal">
                By joining, you agree to receive email notifications regarding updates for this event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
