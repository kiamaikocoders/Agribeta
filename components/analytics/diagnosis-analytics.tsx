import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"

export function DiagnosisAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Disease Diagnosis Analytics</h2>
          <p className="text-gray-500">Track and analyze avocado disease diagnoses over time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue="last30">
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Diagnoses</CardTitle>
            <CardDescription>Number of disease diagnoses performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-green-500 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              +8 from previous period
            </p>
            <div className="mt-4 h-20 flex items-end space-x-2">
              <div className="bg-green-200 dark:bg-green-900 h-8 w-full rounded-sm"></div>
              <div className="bg-green-300 dark:bg-green-800 h-12 w-full rounded-sm"></div>
              <div className="bg-green-400 dark:bg-green-700 h-10 w-full rounded-sm"></div>
              <div className="bg-green-500 dark:bg-green-600 h-14 w-full rounded-sm"></div>
              <div className="bg-green-600 dark:bg-green-500 h-16 w-full rounded-sm"></div>
              <div className="bg-green-700 dark:bg-green-400 h-18 w-full rounded-sm"></div>
              <div className="bg-green-800 dark:bg-green-300 h-20 w-full rounded-sm"></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Week 1</span>
              <span>Week 7</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Diagnosis Accuracy</CardTitle>
            <CardDescription>Average confidence level of diagnoses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-sm text-green-500 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              +3% from previous period
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "87%" }}></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Highest</p>
                <p className="font-medium">98%</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Lowest</p>
                <p className="font-medium">72%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Input Method</CardTitle>
            <CardDescription>Distribution of diagnosis input methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="15"
                    strokeDasharray="188.5 251.3"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold">75%</span>
                    <span className="block text-xs text-gray-500">Uploads</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Uploads</p>
                <p className="font-medium">18 diagnoses</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Camera</p>
                <p className="font-medium">6 diagnoses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disease Distribution</CardTitle>
          <CardDescription>Breakdown of diagnosed diseases in avocados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Anthracnose</span>
                <span className="text-xs">42% (10 cases)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Root Rot</span>
                <span className="text-xs">25% (6 cases)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Cercospora Spot</span>
                <span className="text-xs">17% (4 cases)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "17%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Scab</span>
                <span className="text-xs">8% (2 cases)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Other</span>
                <span className="text-xs">8% (2 cases)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Key Insights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Anthracnose remains the most common disease, consistent with seasonal patterns</li>
              <li>Root rot cases have increased by 15% compared to the previous period</li>
              <li>Early detection has improved treatment success rates by 22%</li>
              <li>Recommended preventative measures have been updated based on recent diagnoses</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
