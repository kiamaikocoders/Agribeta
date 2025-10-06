import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthNotFound() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-agribeta-green">404</h1>
        <h2 className="text-2xl font-semibold">Auth Page Not Found</h2>
        <p className="text-gray-600">
          The authentication page you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <Link href="/auth">
            <Button className="bg-agribeta-green hover:bg-agribeta-green/90">
              Go to Sign In
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



