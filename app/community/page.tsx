import { ForumPosts } from '@/components/community/forum-posts';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Image from 'next/image';

export default function AgribetaConnectPage() {
  return (
    <ProtectedRoute>
    <div className="relative min-h-screen bg-[#F8F9FA]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/greenhouse-robotics.png"
          alt="Greenhouse Robotics"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      <div className="relative z-10 container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#167539] mb-2">Agribeta Connect</h1>
          <p className="text-lg text-[#FC7E19]">A vibrant network for farmers to connect, share, and grow together</p>
        </div>
        <ForumPosts />
      </div>
    </div>
    </ProtectedRoute>
  );
}
