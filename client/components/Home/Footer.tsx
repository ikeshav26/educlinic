import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <div className="w-full bg-white mt-16">
      {/* Social Media Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <h2 className="text-2xl font-semibold text-[#222] mb-6 pl-2">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Facebook Card */}
          <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[450px]">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-white">
              <div className="bg-[#1877F2] rounded-full p-1 w-6 h-6 flex items-center justify-center">
                <FaFacebookF className="text-white text-xs" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">BFCET on Facebook</span>
            </div>
            <div className="flex-1 w-full bg-white relative overflow-hidden">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FBabaFaridGroup&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                width="100%"
                height="100%"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[450px]">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-white">
              <div className="bg-[#E1306C] rounded-full p-1 w-6 h-6 flex items-center justify-center">
                <FaInstagram className="text-white text-xs" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">BFCET on Instagram</span>
            </div>
            <div className="flex-1 w-full bg-white relative overflow-hidden flex flex-col">
              <iframe
                src="https://www.instagram.com/babafaridgroup/embed#"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="yes"
                className="flex-1"
              ></iframe>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-white rounded shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[450px]">
            <div className="p-3 border-b border-gray-100 flex items-center gap-2 bg-white">
              <div className="bg-[#0077b5] rounded-full p-1 w-6 h-6 flex items-center justify-center">
                <FaLinkedinIn className="text-white text-xs" />
              </div>
              <span className="font-semibold text-gray-800 text-sm">BFCET on LinkedIn</span>
            </div>
            <div className="flex-1 w-full bg-white overflow-hidden p-4">
              <a className="text-[#0077b5] hover:underline text-sm font-semibold" href="https://in.linkedin.com/company/baba-farid-group-of-institutions/embed#" target="_blank" rel="noopener noreferrer">
                Visit our LinkedIn Page
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Footer */}
      <footer className="bg-[#222222] text-[#cccccc] py-10 border-t border-[#333]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-3 mb-6">
            <Link href="#" className="w-8 h-8 rounded-full bg-[#dddddd] text-[#222222] flex items-center justify-center hover:bg-white transition-colors">
              <FaFacebookF size={15} />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-[#dddddd] text-[#222222] flex items-center justify-center hover:bg-white transition-colors">
              <FaXTwitter size={15} />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-[#dddddd] text-[#222222] flex items-center justify-center hover:bg-white transition-colors">
              <FaLinkedinIn size={15} />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-[#dddddd] text-[#222222] flex items-center justify-center hover:bg-white transition-colors">
              <FaYoutube size={15} />
            </Link>
            <Link href="#" className="w-8 h-8 rounded-full bg-[#dddddd] text-[#222222] flex items-center justify-center hover:bg-white transition-colors">
              <FaInstagram size={15} />
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] tracking-wide">
            <Link href="#" className="hover:text-white transition-colors">HOME</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="hover:text-white transition-colors">ABOUT</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="hover:text-white transition-colors">CONTACT</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="hover:text-white transition-colors">SITEMAP</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="hover:text-white transition-colors">TERMS</Link>
            <span className="text-gray-500">|</span>
            <Link href="#" className="hover:text-white transition-colors">PRIVACY</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
