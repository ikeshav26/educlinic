'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UserStore } from '@/store/useUserStore';

type RouteItem = {
  name: string;
  path?: string;
  subRoutes?: { name: string; path: string }[];
};

const navigation: RouteItem[] = [
  { name: 'Home', path: '/' },
  {
    name: 'Our Institutions',
    subRoutes: [
      { name: 'School of Engineering', path: 'https://www.bfcet.com' },
      { name: 'School of Sciences', path: 'https://babafaridgroup.edu.in/School-of-Sciences.php' },
      { name: 'School of Agriculture', path: 'https://www.bfcet.com/department-of-agriculture' },
      { name: 'School of Business Studies', path: 'https://www.bfcet.com/dept-management' },
      { name: 'School of Computer Applications', path: 'https://www.bfcet.com/dept-comp-application' },
      { name: 'School of Humanities', path: 'https://www.bfcbti.com/' },
      { name: 'School of Education', path: 'https://www.bfcedu.com/' },
      { name: 'School of Law', path: 'https://babafaridcollegeoflaw.com/' },
      { name: 'School of Pharmacy', path: 'https://www.bfcp.in/' },
    ],
  },
  { name: 'Events', path: '/events' },
  { name: 'Alumni', path: '/alumni' },
  { name: 'Startups', path: 'https://bfsoe.com/startups/' },
  {
    name: 'Research',
    subRoutes: [
      { name: 'Incubation Centre', path: '/research/incubation' },
      { name: 'Research & Development Cell', path: '/research/rnd-cell' },
      { name: 'School of Entrepreneurship', path: 'https://bfsoe.com/' },
    ],
  },
  {
    name: 'Gallery',
    subRoutes: [
      { name: 'Campus Life', path: '/gallery/campus-life' },
      { name: 'Events', path: '/gallery/events' },
      { name: 'Global Internship', path: '/gallery/global-internship' },
      { name: 'Global Summit', path: '/gallery/global-summit' },
    ],
  },
  {
    name: 'About',
    subRoutes: [
      { name: 'About BGFIAA', path: '/about/bgfiaa' },
      { name: 'TEAM', path: '/about/team' },
      { name: 'Noticeboard', path: '/about/noticeboard' },
    ],
  },
  { name: 'Contact Us', path: '/contact' },
];

const MainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = useUserStore((state: UserStore) => state.isAuthenticated);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      useUserStore.getState().clearUser();
      useUserStore.setState({ isAuthenticated: false });
      toast.success('Logged out successfully! ');
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white w-full shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 py-2 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center space-x-6">
          <Link href="/">
            <Image
              src="/logo1.png"
              alt="BABA FARID GROUP OF INSTITUTIONS"
              width={250}
              height={70}
              loading="eager"
              className="w-48 md:w-56 lg:w-64 h-auto object-contain"
            />
          </Link>
          <Image
            src="/logo2.jpg"
            alt="NAAC Logo"
            width={110}
            height={60}
            className="w-auto h-auto object-contain hidden md:block"
          />
        </div>

        <div className="hidden lg:flex items-center space-x-3 xl:space-x-5">
          {navigation.map((item) => {
            const isActive = item.path ? pathname === item.path : false;

            return (
              <div key={item.name} className="relative group py-4">
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`inline-flex items-center text-[15px] font-semibold pb-1 border-b-2 transition-colors ${isActive
                      ? 'border-[#d60000] text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-[#d60000] hover:border-[#d60000]'
                      }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 text-[15px] font-semibold pb-1 border-b-2 transition-colors cursor-pointer group-hover:text-[#d60000] group-hover:border-[#d60000] ${isActive
                      ? 'border-[#d60000] text-gray-900'
                      : 'border-transparent text-gray-600'
                      }`}
                  >
                    {item.name}
                    <ChevronDown size={16} className="mt-0.5" />
                  </span>
                )}

                {item.subRoutes && (
                  <div className="absolute top-[100%] left-0 min-w-[260px] bg-white border border-gray-100 border-t-0 shadow-xl rounded-b-md z-50 grid grid-rows-[0fr] opacity-0 invisible group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                    <div className="overflow-hidden">
                      <div className="flex flex-col py-2">
                        {item.subRoutes.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            className="block px-6 py-2 text-[14px] text-gray-600 hover:text-[#d60000] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-[#d60000] hover:bg-[#b30000] text-white cursor-pointer px-4 py-2 rounded flex items-center justify-center space-x-2 font-medium transition"
              >
                <span>Logout</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <Link href="/auth">
                <button className="bg-[#d60000] hover:bg-[#b30000] text-white cursor-pointer px-4 py-2 rounded flex items-center justify-center space-x-2 font-medium transition">
                  <span>Login</span>
                  <ArrowRight size={18} />
                </button>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden text-gray-700 hover:text-[#d60000] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-2 flex flex-col space-y-2 pb-6 shadow-inner max-h-[70vh] overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name} className="flex flex-col">
              {item.path ? (
                <Link
                  href={item.path}
                  className={`text-base font-medium py-3 px-3 rounded ${pathname === item.path
                    ? 'bg-red-50 text-[#d60000]'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <div className="text-base font-medium py-3 px-3 rounded text-gray-800 flex items-center justify-between">
                  {item.name}
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              )}

              {item.subRoutes && (
                <div className="pl-6 flex flex-col space-y-1 mb-2 border-l-2 border-gray-100 ml-4">
                  {item.subRoutes.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      className={`text-sm py-2.5 px-3 rounded ${pathname === sub.path
                        ? 'bg-red-50 text-[#d60000]'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="bg-[#d60000] hover:bg-[#b30000] text-white cursor-pointer px-4 py-3 mt-4 rounded flex items-center justify-center space-x-2 font-medium w-full"
            >
              <span>Logout</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-[#d60000] hover:bg-[#b30000] text-white px-4 py-3 mt-4 rounded flex items-center justify-center space-x-2 font-medium w-full">
                <span>Join Network</span>
                <ArrowRight size={18} />
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MainNav;
