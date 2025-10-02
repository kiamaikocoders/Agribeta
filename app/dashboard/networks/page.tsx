import { ProtectedRoute } from '@/components/auth/protected-route'
import { NetworksFeed } from '@/components/networks/networks-feed'
import Image from 'next/image'

export default function NetworksPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-[#F8F9FA]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/greenhouse-robotics.png"
            alt="Greenhouse Robotics"
            fill
            className="object-cover opacity-5"
            priority
          />
        </div>
        
        <div className="relative z-10">
          <NetworksFeed />
        </div>
      </div>
    </ProtectedRoute>
  )
}
