import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForumPosts } from "@/components/community/forum-posts"
import { ResourceLibrary } from "@/components/community/resource-library"
import { ContactForm } from "@/components/community/contact-form"
import Image from "next/image"

export default function CommunityPage() {
  return (
    <div className="relative min-h-screen">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-agribeta-green mb-2">Community Hub</h1>
          <p className="text-lg text-muted-foreground">Connect with other growers, access resources, and get support</p>
        </div>

        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="forum">Discussion Forum</TabsTrigger>
            <TabsTrigger value="resources">Resource Library</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <ForumPosts />
          </TabsContent>

          <TabsContent value="resources" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <ResourceLibrary />
          </TabsContent>

          <TabsContent value="contact" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
