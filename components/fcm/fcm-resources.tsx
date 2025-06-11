import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from "lucide-react"

export function FCMResources() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>EU Regulations</CardTitle>
          <CardDescription>Official documents related to FCM management requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">EU Regulation 2019/2072</h3>
                  <p className="text-sm text-gray-500">
                    Establishing uniform conditions for the implementation of Regulation (EU) 2016/2031
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">EU Regulation 2024/2004</h3>
                  <p className="text-sm text-gray-500">
                    Specific requirements for the import of roses from third countries
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">ISPM 14 Guidelines</h3>
                  <p className="text-sm text-gray-500">
                    The use of integrated measures in a systems approach for pest risk management
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Educational Materials</CardTitle>
          <CardDescription>Training resources and guides for FCM management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <img src="/placeholder.svg?key=kqfzj" alt="FCM Lifecycle" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-medium mb-2">FCM Lifecycle Infographic</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed visual guide to the lifecycle of False Codling Moth and identification at each stage.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Infographic
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <img src="/placeholder.svg?key=qg043" alt="Monitoring System" className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-medium mb-2">Monitoring System Guide</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Step-by-step guide to setting up and maintaining an effective FCM monitoring system.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrated Pest Management</CardTitle>
          <CardDescription>Resources for implementing IPM strategies for FCM control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Biological Controls</h3>
              <p className="text-gray-600 mb-4">
                Information on biological control agents effective against FCM, including Cryptophlebia leucotreta
                granulovirus and Beauveria bassiana.
              </p>
              <Button variant="link" size="sm" className="px-0">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Chemical Controls</h3>
              <p className="text-gray-600 mb-4">
                Guidelines for the responsible use of approved pesticides for FCM management, including Spinetoram,
                Acephate, Belt, and Coragen.
              </p>
              <Button variant="link" size="sm" className="px-0">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Cultural Practices</h3>
              <p className="text-gray-600 mb-4">
                Best practices for greenhouse management to reduce FCM risk, including sanitation, crop rotation, and
                environmental controls.
              </p>
              <Button variant="link" size="sm" className="px-0">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
