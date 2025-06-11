"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Loader2,
  Send,
  Upload,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function FCMComplianceReporting() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [complianceScore, setComplianceScore] = useState(78)
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])
  const [reportPeriod, setReportPeriod] = useState("monthly")

  const generateReport = () => {
    setIsGenerating(true)

    // Simulate API call to generate report
    setTimeout(() => {
      setIsGenerating(false)
      setReportGenerated(true)
    }, 2500)
  }

  const resetForm = () => {
    setReportGenerated(false)
    setReportDate(new Date().toISOString().split("T")[0])
    setReportPeriod("monthly")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-agribeta-green">FCM Compliance Reporting</h2>
          <p className="text-gray-500">
            Generate EU-compliant reports for FCM management activities and compliance status
          </p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
          >
            Generate Report
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-agribeta-orange data-[state=active]:text-white"
          >
            Report History
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
          >
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-agribeta-green/20">
              <CardHeader>
                <CardTitle className="text-agribeta-green">Report Configuration</CardTitle>
                <CardDescription>Configure the parameters for your FCM compliance report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="report-date">Report Date</Label>
                  <div className="relative">
                    <Input
                      id="report-date"
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-period">Report Period</Label>
                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger
                      id="report-period"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select report period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greenhouse-id">Greenhouse ID</Label>
                  <Select defaultValue="all">
                    <SelectTrigger
                      id="greenhouse-id"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select greenhouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Greenhouses</SelectItem>
                      <SelectItem value="gh-a">Greenhouse A</SelectItem>
                      <SelectItem value="gh-b">Greenhouse B</SelectItem>
                      <SelectItem value="gh-c">Greenhouse C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Include Sections</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="monitoring" defaultChecked />
                      <Label htmlFor="monitoring" className="text-sm font-normal">
                        Monitoring Data
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="structural" defaultChecked />
                      <Label htmlFor="structural" className="text-sm font-normal">
                        Structural Compliance
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="treatments" defaultChecked />
                      <Label htmlFor="treatments" className="text-sm font-normal">
                        Treatments Applied
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="detections" defaultChecked />
                      <Label htmlFor="detections" className="text-sm font-normal">
                        FCM Detections & Actions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recommendations" defaultChecked />
                      <Label htmlFor="recommendations" className="text-sm font-normal">
                        Recommendations
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger
                      id="report-format"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="both">Both Formats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm} disabled={isGenerating}>
                  Reset
                </Button>
                <Button
                  className="bg-agribeta-green hover:bg-agribeta-green/90"
                  onClick={generateReport}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className={cn("border-agribeta-orange/20", !reportGenerated && !isGenerating && "opacity-50")}>
              <CardHeader>
                <CardTitle className="text-agribeta-orange">Report Preview</CardTitle>
                <CardDescription>Preview and download your FCM compliance report</CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <Loader2 className="h-12 w-12 animate-spin text-agribeta-orange mb-4" />
                    <p className="text-lg font-medium">Generating Report...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                    <div className="w-full max-w-xs mt-6">
                      <Progress value={45} className="h-2 bg-gray-200" />
                    </div>
                  </div>
                ) : reportGenerated ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-agribeta-orange mr-3" />
                        <div>
                          <h3 className="font-medium">FCM Compliance Report</h3>
                          <p className="text-sm text-gray-500">
                            {reportPeriod === "weekly"
                              ? "Weekly"
                              : reportPeriod === "biweekly"
                                ? "Bi-weekly"
                                : reportPeriod === "monthly"
                                  ? "Monthly"
                                  : "Quarterly"}{" "}
                            Report - {reportDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <div className="relative">
                          <svg className="w-24 h-24">
                            <circle
                              className="text-gray-300"
                              strokeWidth="5"
                              stroke="currentColor"
                              fill="transparent"
                              r="45"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className={cn(
                                "text-agribeta-green",
                                complianceScore < 60 && "text-red-500",
                                complianceScore >= 60 && complianceScore < 80 && "text-amber-500",
                              )}
                              strokeWidth="5"
                              strokeDasharray={`${complianceScore * 2.83} 283`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="45"
                              cx="50"
                              cy="50"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">{complianceScore}%</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2">Overall Compliance Score</h3>
                      <p className="text-center text-gray-600 mb-4">
                        Your facility is{" "}
                        {complianceScore >= 80
                          ? "fully compliant"
                          : complianceScore >= 60
                            ? "partially compliant"
                            : "non-compliant"}{" "}
                        with EU regulations for FCM management.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-agribeta-green">Compliance Summary</h4>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium">Greenhouse Structure</span>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              100% Compliant
                            </span>
                          </div>
                          <Progress value={100} className="h-2 bg-gray-200" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                              <span className="text-sm font-medium">Monitoring Protocol</span>
                            </div>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Partially Compliant
                            </span>
                          </div>
                          <Progress value={60} className="h-2 bg-gray-200" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-600 mr-2" />
                              <span className="text-sm font-medium">Documentation</span>
                            </div>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                              Non-compliant
                            </span>
                          </div>
                          <Progress value={30} className="h-2 bg-gray-200" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" className="border-agribeta-orange text-agribeta-orange">
                        <Send className="mr-2 h-4 w-4" />
                        Email Report
                      </Button>
                      <Button className="bg-agribeta-orange hover:bg-agribeta-orange/90">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <ClipboardCheck className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Report Generated</h3>
                    <p className="text-gray-500 max-w-md">
                      Configure the report parameters on the left and click "Generate Report" to create your FCM
                      compliance report.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-agribeta-orange/20">
            <CardHeader>
              <CardTitle className="text-agribeta-orange">Report History</CardTitle>
              <CardDescription>Access and download previously generated FCM compliance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                  <Input
                    placeholder="Search reports..."
                    className="pl-9 border-agribeta-green focus-visible:ring-agribeta-green"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
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
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="border-agribeta-green text-agribeta-green">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                  <Button variant="outline" className="border-agribeta-green text-agribeta-green">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted text-sm font-medium">
                  <div className="col-span-2">Report Name</div>
                  <div>Date</div>
                  <div>Type</div>
                  <div>Score</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y">
                  <div className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-2 flex items-center">
                      <FileText className="h-5 w-5 text-agribeta-green mr-2" />
                      <span>Monthly FCM Compliance Report</span>
                    </div>
                    <div>2023-05-01</div>
                    <div>Monthly</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        85%
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          className="h-4 w-4"
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-2 flex items-center">
                      <FileText className="h-5 w-5 text-agribeta-orange mr-2" />
                      <span>Quarterly FCM Compliance Report</span>
                    </div>
                    <div>2023-04-01</div>
                    <div>Quarterly</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        78%
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          className="h-4 w-4"
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/50">
                    <div className="col-span-2 flex items-center">
                      <FileText className="h-5 w-5 text-agribeta-green mr-2" />
                      <span>Monthly FCM Compliance Report</span>
                    </div>
                    <div>2023-03-01</div>
                    <div>Monthly</div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        58%
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <svg
                          className="h-4 w-4"
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Showing 3 of 12 reports</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-agribeta-green text-white border-agribeta-green">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card className="border-agribeta-green/20">
            <CardHeader>
              <CardTitle className="text-agribeta-green">Report Templates</CardTitle>
              <CardDescription>Manage and customize FCM compliance report templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-agribeta-green/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-agribeta-green">EU Standard</CardTitle>
                    <CardDescription>Official EU compliance format</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500 justify-between">
                      <span>Default template</span>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-agribeta-orange/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-agribeta-orange">Detailed</CardTitle>
                    <CardDescription>Comprehensive reporting format</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Includes all monitoring data</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-dashed border-2 border-gray-300 bg-transparent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-500">Custom Template</CardTitle>
                    <CardDescription>Create your own template</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 flex flex-col items-center justify-center h-[calc(100%-100px)]">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
                      <svg
                        className="h-6 w-6 text-gray-400"
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
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">Create New</span>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Template Customization</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Customize your report templates to include specific sections, branding, and formatting to meet your
                  organization's needs.
                </p>
                <Button className="bg-agribeta-green hover:bg-agribeta-green/90">Template Editor</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
