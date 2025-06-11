import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FCMOverview } from "@/components/fcm/fcm-overview"
import { FCMMonitoring } from "@/components/fcm/fcm-monitoring"
import { FCMCompliance } from "@/components/fcm/fcm-compliance"
import { FCMResources } from "@/components/fcm/fcm-resources"
import { FCMDocumentViewer } from "@/components/fcm/fcm-document-viewer"
import { FCMPredictiveAnalytics } from "@/components/fcm/fcm-predictive-analytics"
import { FCMComplianceReporting } from "@/components/fcm/fcm-compliance-reporting"
import Image from "next/image"

export default function FCMManagementPage() {
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
          <h1 className="text-4xl font-bold text-agribeta-green mb-2">FCM Management System</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools for managing False Codling Moth in rose cultivation
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="document">Documentation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMOverview />
          </TabsContent>

          <TabsContent value="monitoring" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMMonitoring />
          </TabsContent>

          <TabsContent value="compliance" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMCompliance />
          </TabsContent>

          <TabsContent value="document" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMDocumentViewer />
          </TabsContent>

          <TabsContent value="analytics" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMPredictiveAnalytics />
          </TabsContent>

          <TabsContent value="reporting" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMComplianceReporting />
          </TabsContent>

          <TabsContent value="resources" className="p-6 bg-card rounded-lg border shadow-sm">
            <FCMResources />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
