'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-100 select-none">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mt-2 mb-2">Page Not Found</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}