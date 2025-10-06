import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, AlertTriangle, CheckCircle2 } from "lucide-react"

export function FCMOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Zero Tolerance</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Even one FCM pinpoint results in lot rejection</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">EU Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-blue-50">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>Required under regulations 2019/2072 & 2024/2004</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Systems Approach</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Follows ISPM 14 international standards</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FCM Identification</CardTitle>
          <CardDescription>Critical Pest: Thaumatotibia leucotreta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Adult Moth</h3>
              <img
                src="/placeholder.svg?key=vk90h"
                alt="Adult FCM"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-600">10-15mm wingspan, gray-brown with dark markings</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Larvae</h3>
              <img
                src="/placeholder.svg?key=wh97q"
                alt="FCM Larvae"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-600">Pink-white caterpillars up to 15mm, primary damaging stage</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Damage Signs</h3>
              <img
                src="/placeholder.svg?key=fcvi9"
                alt="FCM Damage"
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-600">Entry holes, frass, discoloration on rose stems and buds</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Greenhouse Requirements</CardTitle>
          <CardDescription>
            Structural standards must be maintained at all times and verified through regular audits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Structural Integrity</h3>
              <p className="text-gray-600">
                Maintain polythene covers with no tears or damages; repair immediately if compromised
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Insect-Proof Netting</h3>
              <p className="text-gray-600">T7-20 mesh netting on all openings and vents; inspect weekly for damage</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Entry/Exit Control</h3>
              <p className="text-gray-600">
                Double-door systems with self-closing mechanism at all greenhouse entrances
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Facility Registration</h3>
              <p className="text-gray-600">
                Register with KEPHIS (Kenya) or EAA (Ethiopia); obtain unique production site code
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Principles of FCM Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Prevention</h3>
              <p className="text-sm text-gray-600">Rigorous greenhouse standards to block FCM entry</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Detection</h3>
              <p className="text-sm text-gray-600">Systematic monitoring via traps and scouting</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Response</h3>
              <p className="text-sm text-gray-600">Zero-tolerance policy with swift corrective measures</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Traceability</h3>
              <p className="text-sm text-gray-600">Unique site codes and documentation throughout process</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
