import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 py-12">
      <h1 className="text-6xl font-bold text-agribeta-green mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <button className="bg-agribeta-orange text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-agribeta-orange/90 transition-colors duration-300">
          Go to Homepage
        </button>
      </Link>
    </div>
  )
} 