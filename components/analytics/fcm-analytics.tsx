import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Download, Calendar } from "lucide-react"

export function FCMAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">FCM Monitoring Analytics</h2>
          <p className="text-gray-500">Track and analyze FCM monitoring data over time</p>
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
            <CardTitle className="text-lg">FCM Trap Catches</CardTitle>
            <CardDescription>Total FCM caught in monitoring traps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-red-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              +4 from previous period
            </p>
            <div className="mt-4 h-20 flex items-end space-x-2">
              <div className="bg-green-200 dark:bg-green-900 h-4 w-full rounded-sm"></div>
              <div className="bg-green-300 dark:bg-green-800 h-8 w-full rounded-sm"></div>
              <div className="bg-green-400 dark:bg-green-700 h-6 w-full rounded-sm"></div>
              <div className="bg-green-500 dark:bg-green-600 h-12 w-full rounded-sm"></div>
              <div className="bg-green-600 dark:bg-green-500 h-16 w-full rounded-sm"></div>
              <div className="bg-green-700 dark:bg-green-400 h-10 w-full rounded-sm"></div>
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
            <CardTitle className="text-lg">Monitoring Compliance</CardTitle>
            <CardDescription>Percentage of scheduled monitoring completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">86%</div>
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
              +12% from previous period
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "86%" }}></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Scheduled</p>
                <p className="font-medium">28 sessions</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Completed</p>
                <p className="font-medium">24 sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Greenhouse Risk Assessment</CardTitle>
            <CardDescription>FCM risk level by greenhouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Greenhouse A</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Low Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Greenhouse B</span>
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Medium Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Greenhouse C</span>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">High Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Greenhouse D</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Low Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FCM Detection Trends</CardTitle>
          <CardDescription>Historical FCM detection data across all greenhouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-end justify-between p-4">
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "40px" }}></div>
              <span className="text-xs mt-2">Jan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "60px" }}></div>
              <span className="text-xs mt-2">Feb</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "30px" }}></div>
              <span className="text-xs mt-2">Mar</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "80px" }}></div>
              <span className="text-xs mt-2">Apr</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "120px" }}></div>
              <span className="text-xs mt-2">May</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "200px" }}></div>
              <span className="text-xs mt-2">Jun</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "160px" }}></div>
              <span className="text-xs mt-2">Jul</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "100px" }}></div>
              <span className="text-xs mt-2">Aug</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "70px" }}></div>
              <span className="text-xs mt-2">Sep</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "50px" }}></div>
              <span className="text-xs mt-2">Oct</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "40px" }}></div>
              <span className="text-xs mt-2">Nov</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: "30px" }}></div>
              <span className="text-xs mt-2">Dec</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Peak Season:</span> June-July
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Chart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
