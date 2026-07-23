'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const ContactPage = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="w-full h-[400px] lg:h-[450px] relative bg-gray-100">
        {!isMapLoaded && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center animate-pulse">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#d60000] rounded-full animate-spin mb-3"></div>
            <span className="text-gray-500 font-medium">Loading Map...</span>
          </div>
        )}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3447.880733791609!2d74.8420018!3d30.2510336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391731172aeedaaf%3A0x7d09b26e96ee593b!2sBaba%20Farid%20Group%20of%20Institutions!5e0!3m2!1sen!2sin!4v1707572391234!5m2!1sen!2sin"
          className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-700 ease-in-out ${
            isMapLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsMapLoaded(true)}
        ></iframe>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col h-full bg-white border border-gray-200 shadow-sm">
            <div className="relative h-64 w-full">
              <Image
                src="/contact.jpg"
                alt="Contact Us Icons"
                fill
                className="object-cover"
              />
            </div>

            <div className="bg-[#d60000] text-white px-6 py-4">
              <h2 className="text-xl font-bold tracking-wide uppercase">
                Contact Us in India
              </h2>
            </div>

            <div className="p-6 md:p-8 flex flex-col gap-4 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-[#d60000] text-xl leading-none mt-0.5">
                  ♦
                </span>
                <p className="text-[15px] font-medium">
                  Baba Farid Group of Institutions, Bathinda, Punjab, India.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d60000] text-xl leading-none mt-0.5">
                  ♦
                </span>
                <p className="text-[15px] font-medium">
                  contactus@babafaridgroup.com
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d60000] text-xl leading-none mt-0.5">
                  ♦
                </span>
                <p className="text-[15px] font-medium">
                  admissions@babafaridgroup.edu.in
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d60000] text-xl leading-none mt-0.5">
                  ♦
                </span>
                <p className="text-[15px] font-medium">
                  +91 8081-100-200 (Helpline)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#002147] text-white p-8 md:p-10 lg:p-12 flex flex-col justify-center h-full shadow-md">
            <h2 className="text-3xl font-semibold mb-2">Get in Touch</h2>
            <p className="text-gray-300 text-sm mb-8">
              Please fill out the form and we will contact you asap.
            </p>

            <form className="flex flex-col gap-5">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Your Mobile No."
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none"
                  required
                ></textarea>
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Form submission is mock only for now!');
                  }}
                  className="bg-[#f0a500] hover:bg-[#d99500] text-white font-bold py-3 px-8 rounded shadow-md transition-colors w-max"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
