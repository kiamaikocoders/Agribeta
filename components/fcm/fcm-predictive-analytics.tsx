"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { AlertTriangle, BarChart2, Download, LineChart, Loader2, ThermometerSun } from "lucide-react"
import { cn } from "@/lib/utils"

export function FCMPredictiveAnalytics() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium")
  const [temperature, setTemperature] = useState([25])
  const [humidity, setHumidity] = useState([65])
  const [greenhouseAge, setGreenhouseAge] = useState("0-2")
  const [previousDetections, setPreviousDetections] = useState("0")
  const [nearbyFarms, setNearbyFarms] = useState("no")

  const generateForecast = () => {
    setIsGenerating(true)

    // Simulate API call to Groq for predictive analytics
    setTimeout(() => {
      // Calculate risk based on inputs
      let risk = 0

      // Temperature factor (FCM thrives in 20-30°C)
      const temp = temperature[0]
      if (temp >= 22 && temp <= 28) {
        risk += 30 // High risk temperature range
      } else if ((temp >= 18 && temp < 22) || (temp > 28 && temp <= 32)) {
        risk += 20 // Medium risk temperature range
      } else {
        risk += 10 // Low risk temperature range
      }

      // Humidity factor
      const humid = humidity[0]
      if (humid >= 60 && humid <= 80) {
        risk += 25 // High risk humidity range
      } else if ((humid >= 50 && humid < 60) || (humid > 80 && humid <= 90)) {
        risk += 15 // Medium risk humidity range
      } else {
        risk += 5 // Low risk humidity range
      }

      // Previous detections factor
      if (previousDetections === "5+") {
        risk += 25
      } else if (previousDetections === "1-4") {
        risk += 15
      } else {
        risk += 5
      }

      // Nearby farms factor
      if (nearbyFarms === "yes-infested") {
        risk += 15
      } else if (nearbyFarms === "yes-unknown") {
        risk += 10
      } else {
        risk += 0
      }

      // Greenhouse age factor
      if (greenhouseAge === "5+") {
        risk += 5
      } else if (greenhouseAge === "2-5") {
        risk += 3
      } else {
        risk += 1
      }

      // Determine risk level
      if (risk >= 70) {
        setRiskLevel("high")
      } else if (risk >= 40) {
        setRiskLevel("medium")
      } else {
        setRiskLevel("low")
      }

      setIsGenerating(false)
      setShowResults(true)
    }, 2000)
  }

  const resetForm = () => {
    setTemperature([25])
    setHumidity([65])
    setGreenhouseAge("0-2")
    setPreviousDetections("0")
    setNearbyFarms("no")
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-agribeta-green">FCM Outbreak Prediction</h2>
          <p className="text-gray-500">
            Use AI-powered analytics to predict potential FCM outbreaks based on environmental and historical data.
          </p>
        </div>
      </div>

      <Tabs defaultValue="forecast" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="forecast"
            className="data-[state=active]:bg-agribeta-green data-[state=active]:text-white"
          >
            Risk Forecast
          </TabsTrigger>
          <TabsTrigger
            value="historical"
            className="data-[state=active]:bg-agribeta-orange data-[state=active]:text-white"
          >
            Historical Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-agribeta-green/20">
              <CardHeader>
                <CardTitle className="text-agribeta-green">Forecast Parameters</CardTitle>
                <CardDescription>
                  Adjust the parameters below to generate a customized FCM risk forecast
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature" className="text-base">
                      Temperature (°C)
                    </Label>
                    <span className="font-medium">{temperature}°C</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={15}
                    max={35}
                    step={1}
                    value={temperature}
                    onValueChange={setTemperature}
                    className="[&>span:first-child]:bg-agribeta-green"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>15°C</span>
                    <span>25°C</span>
                    <span>35°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="humidity" className="text-base">
                      Humidity (%)
                    </Label>
                    <span className="font-medium">{humidity}%</span>
                  </div>
                  <Slider
                    id="humidity"
                    min={30}
                    max={100}
                    step={1}
                    value={humidity}
                    onValueChange={setHumidity}
                    className="[&>span:first-child]:bg-agribeta-orange"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>30%</span>
                    <span>65%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greenhouse-age" className="text-base">
                    Greenhouse Age (years)
                  </Label>
                  <Select value={greenhouseAge} onValueChange={setGreenhouseAge}>
                    <SelectTrigger
                      id="greenhouse-age"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select greenhouse age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="5+">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previous-detections" className="text-base">
                    Previous FCM Detections (last 3 months)
                  </Label>
                  <Select value={previousDetections} onValueChange={setPreviousDetections}>
                    <SelectTrigger
                      id="previous-detections"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select number of detections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1-4">1-4 detections</SelectItem>
                      <SelectItem value="5+">5+ detections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nearby-farms" className="text-base">
                    Nearby Farms with Roses
                  </Label>
                  <Select value={nearbyFarms} onValueChange={setNearbyFarms}>
                    <SelectTrigger
                      id="nearby-farms"
                      className="border-agribeta-green focus-visible:ring-agribeta-green"
                    >
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No nearby farms</SelectItem>
                      <SelectItem value="yes-unknown">Yes, FCM status unknown</SelectItem>
                      <SelectItem value="yes-infested">Yes, with known FCM infestations</SelectItem>
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
                  onClick={generateForecast}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Forecast"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className={cn("border-agribeta-orange/20", !showResults && "opacity-50")}>
              <CardHeader>
                <CardTitle className="text-agribeta-orange">Risk Assessment</CardTitle>
                <CardDescription>AI-generated FCM risk forecast based on your parameters</CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-80">
                    <Loader2 className="h-12 w-12 animate-spin text-agribeta-orange mb-4" />
                    <p className="text-lg font-medium">Analyzing data...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </div>
                ) : showResults ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-40 h-40 rounded-full flex items-center justify-center mb-4",
                          riskLevel === "low" ? "bg-green-100" : riskLevel === "medium" ? "bg-amber-100" : "bg-red-100",
                        )}
                      >
                        <div
                          className={cn(
                            "w-32 h-32 rounded-full flex flex-col items-center justify-center text-white",
                            riskLevel === "low"
                              ? "bg-green-500"
                              : riskLevel === "medium"
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                        >
                          <span className="text-lg font-medium capitalize">{riskLevel}</span>
                          <span className="text-3xl font-bold">Risk</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 capitalize">
                        {riskLevel === "low"
                          ? "Low Risk of FCM Outbreak"
                          : riskLevel === "medium"
                            ? "Medium Risk of FCM Outbreak"
                            : "High Risk of FCM Outbreak"}
                      </h3>

                      <p className="text-center text-gray-600 mb-4">
                        {riskLevel === "low"
                          ? "Current conditions indicate a low probability of FCM infestation. Continue standard monitoring protocols."
                          : riskLevel === "medium"
                            ? "Moderate risk of FCM activity detected. Consider increasing monitoring frequency and implementing preventative measures."
                            : "High risk alert! Conditions are highly favorable for FCM development. Immediate preventative action recommended."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-agribeta-green">Recommended Actions</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {riskLevel === "low" ? (
                          <>
                            <li>Maintain standard twice-weekly monitoring</li>
                            <li>Continue regular greenhouse maintenance</li>
                            <li>Ensure staff training on FCM identification is up to date</li>
                            <li>Review and update emergency response protocols</li>
                          </>
                        ) : riskLevel === "medium" ? (
                          <>
                            <li>Increase monitoring frequency to three times weekly</li>
                            <li>Implement preventative biological controls</li>
                            <li>Inspect greenhouse structure for potential entry points</li>
                            <li>Enhance staff vigilance during harvest and packing</li>
                            <li>Consider prophylactic treatments in high-risk areas</li>
                          </>
                        ) : (
                          <>
                            <li>Implement daily monitoring of all traps</li>
                            <li>Apply approved preventative treatments immediately</li>
                            <li>Conduct thorough inspection of all plants</li>
                            <li>Increase packhouse inspection rate to 50% of lots</li>
                            <li>Alert neighboring farms of increased risk</li>
                            <li>Prepare for potential corrective actions if FCM is detected</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" className="border-agribeta-orange text-agribeta-orange">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center">
                    <ThermometerSun className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Forecast Generated</h3>
                    <p className="text-gray-500 max-w-md">
                      Adjust the parameters on the left and click "Generate Forecast" to receive an AI-powered FCM risk
                      assessment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historical" className="mt-6">
          <Card className="border-agribeta-orange/20">
            <CardHeader>
              <CardTitle className="text-agribeta-orange">Historical FCM Patterns</CardTitle>
              <CardDescription>Analysis of FCM detection patterns and environmental correlations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-agribeta-green mb-4">Seasonal FCM Activity</h3>
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-md p-4 flex items-end justify-between">
                    {/* Simulated chart for seasonal FCM activity */}
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "40px" }}></div>
                      <span className="text-xs mt-2">Jan</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "60px" }}></div>
                      <span className="text-xs mt-2">Feb</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "80px" }}></div>
                      <span className="text-xs mt-2">Mar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "120px" }}></div>
                      <span className="text-xs mt-2">Apr</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "160px" }}></div>
                      <span className="text-xs mt-2">May</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "180px" }}></div>
                      <span className="text-xs mt-2">Jun</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "140px" }}></div>
                      <span className="text-xs mt-2">Jul</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "100px" }}></div>
                      <span className="text-xs mt-2">Aug</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "70px" }}></div>
                      <span className="text-xs mt-2">Sep</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "50px" }}></div>
                      <span className="text-xs mt-2">Oct</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "30px" }}></div>
                      <span className="text-xs mt-2">Nov</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-agribeta-green w-8 rounded-t-sm" style={{ height: "20px" }}></div>
                      <span className="text-xs mt-2">Dec</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Peak season: April-July</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <LineChart className="h-4 w-4 mr-1" />
                      <span className="text-xs">View Details</span>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-agribeta-orange mb-4">Temperature Correlation</h3>
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-md p-4 relative">
                    {/* Simulated scatter plot for temperature correlation */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-2/3 left-1/4 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-3/4 left-2/3 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-1/5 left-3/4 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-2/5 left-4/5 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-3/5 left-1/5 w-3 h-3 rounded-full bg-agribeta-orange"></div>
                    <div className="absolute top-4/5 left-3/5 w-3 h-3 rounded-full bg-agribeta-orange"></div>

                    {/* Add trend line */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-3/4 h-0.5 bg-agribeta-green transform rotate-45"></div>
                    </div>

                    {/* Axes labels */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                      Temperature (°C)
                    </div>
                    <div className="absolute top-1/2 left-2 transform -rotate-90 -translate-y-1/2 text-xs text-gray-500">
                      FCM Activity
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Optimal range: 22-28°C</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <BarChart2 className="h-4 w-4 mr-1" />
                      <span className="text-xs">View Details</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Key Risk Factors</h4>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-amber-700 dark:text-amber-400">
                      <li>Sustained temperatures between 22-28°C for more than 7 days</li>
                      <li>Humidity levels above 65% combined with temperatures above 25°C</li>
                      <li>Previous FCM detections within the last 3 months</li>
                      <li>Proximity to other rose farms with known FCM issues</li>
                      <li>Structural vulnerabilities in greenhouse (tears, gaps in netting)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-agribeta-green/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Historical Peak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">June</div>
                    <p className="text-xs text-gray-500">Highest FCM activity month</p>
                  </CardContent>
                </Card>

                <Card className="border-agribeta-orange/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Optimal Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25°C</div>
                    <p className="text-xs text-gray-500">For FCM development</p>
                  </CardContent>
                </Card>

                <Card className="border-agribeta-green/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Development Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">30-45</div>
                    <p className="text-xs text-gray-500">Days from egg to adult</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-agribeta-orange hover:bg-agribeta-orange/90">
                <Download className="mr-2 h-4 w-4" />
                Download Historical Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
