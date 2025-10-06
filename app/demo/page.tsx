export default function CreateAccountPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <h1 className="text-4xl font-bold text-agribeta-green">Create Account</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Join AgriBeta and start your 30-day free trial today.</p>
      <a href="/auth" className="mt-6 bg-agribeta-orange hover:bg-agribeta-orange/90 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300">
        Get Started Now
      </a>
    </div>
  )
} 