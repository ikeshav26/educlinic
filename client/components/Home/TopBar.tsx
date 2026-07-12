import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="bg-[#222222] w-full py-2 px-4 md:px-8 lg:px-16 xl:px-32 flex flex-col lg:flex-row items-center justify-between text-white text-sm border-b border-black">
      <div className="flex items-center space-x-4 mb-2 lg:mb-0">
        <h1 className="font-bold tracking-wide text-lg text-white">
          Alumni Portal
        </h1>
        <span className="hidden text-gray-500 md:inline">|</span>
        <Link
          href="/auth"
          className="bg-[#e31e24] px-3 py-1 text-white font-semibold hover:bg-red-700 transition rounded-sm text-xs"
        >
          Apply Now
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs md:text-sm font-medium">
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin size={16} className="text-[#e31e24]" />
          <span>Muktsar Road, Bathinda, Punjab</span>
        </div>
        <span className="hidden text-gray-500 md:inline">|</span>
        <div className="flex items-center space-x-2 text-gray-300">
          <Phone size={16} className="text-[#e31e24]" />
          <span>+91 8081-100-200</span>
        </div>
        <span className="hidden text-gray-500 md:inline">|</span>
        <div className="flex items-center space-x-2 text-gray-300">
          <Clock size={16} className="text-[#e31e24]" />
          <span>Mon - Fri 8:50 - 16:00</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
