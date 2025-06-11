import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageBackground } from "@/components/page-background"
import Link from "next/link"

export default function DashboardPage() {
  const modules = [
    {
      title: "Avocado Disease Diagnosis",
      description: "Upload images to diagnose avocado plant diseases",
      link: "/diagnosis",
      icon: "🥑",
    },
    {
      title: "FCM Management",
      description: "Monitor and manage False Codling Moth in roses",
      link: "/fcm-management",
      icon: "🌹",
    },
    {
      title: "Analytics Dashboard",
      description: "View insights and analytics for your farm",
      link: "/analytics",
      icon: "📊",
    },
    {
      title: "Community Hub",
      description: "Connect with other growers and access resources",
      link: "/community",
      icon: "👥",
    },
  ]

  return (
    <PageBackground imageSrc="/greenhouse-robotics.png" opacity={0.1}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-agribeta-green mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Welcome to AgriBeta. Select a module to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link href={module.link} key={module.title}>
              <Card className="h-full transition-all hover:shadow-md hover:border-agribeta-green bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="text-4xl mb-2">{module.icon}</div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-agribeta-green font-medium">Click to access →</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageBackground>
  )
}
