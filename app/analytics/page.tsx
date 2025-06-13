// Update the import path below if your Tabs components are located elsewhere
// Update the import path below to the correct location of your Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { OverviewDashboard } from "../../components/analytics/overview-dashboard"
import { FCMAnalytics } from "../../components/analytics/fcm-analytics"
import { DiagnosisAnalytics } from "../../components/analytics/diagnosis-analytics"
import Image from "next/image"

export default function AnalyticsPage() {
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
          <h1 className="text-4xl font-bold text-agribeta-green mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive analytics and insights for your agricultural operations
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fcm">FCM Analytics</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <OverviewDashboard />
          </TabsContent>

          <TabsContent value="fcm" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <FCMAnalytics />
          </TabsContent>

          <TabsContent value="diagnosis" className="p-6 bg-card/90 backdrop-blur-sm rounded-lg border shadow-sm">
            <DiagnosisAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
