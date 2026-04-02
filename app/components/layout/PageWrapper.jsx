'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/ui/Navbar';
import Footer from '@/app/components/ui/Footer';
import Spinner from '@/app/components/ui/Spinner';

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<Spinner />}>
        <Navbar />
      </Suspense>

      <div className="flex-1">
        {loading ? <Spinner /> : <Suspense fallback={<Spinner />}>{children}</Suspense>}
      </div>

      <Footer />

      {/* WhatsApp Button */}
      <div className="fixed bg-gray-300 hover:bg-gray-200 right-5 p-4 rounded-full bottom-[15%] shadow-gray-800 shadow-lg">
        <Link
          href="https://wa.me/+2347072971284?text=Hello%20there!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-5 group"
        >
          <Image src="/whatsapp.webp" alt="WhatsApp" width={18} height={18} className="w-4" />
          {/* <p className="hidden group-hover:flex duration-500 text-black transition-all group-hover:translate-x-0">
            How Can We Help You
          </p> */}
        </Link>
      </div>

      {/* Instagram Button */}
      <div className="fixed transition-all duration-500 group bg-gray-100 hover:bg-gray-200 right-5 p-4 rounded-full bottom-[22%] shadow-lg shadow-gray-800">
        <Link
          href="https://www.instagram.com/mapbyruby/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-5 group"
        >
          <Image src="/instagram.webp" alt="Instagram" width={18} height={18} className="w-4" />
        </Link>
      </div>
    </div>
  );
}
