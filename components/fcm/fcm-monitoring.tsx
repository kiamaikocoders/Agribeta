"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function FCMMonitoring() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Schedule</CardTitle>
          <CardDescription>Conduct all monitoring activities twice weekly with documented results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="greenhouse">Greenhouse</Label>
              <div className="flex gap-2 mt-1">
                <Input id="greenhouse" placeholder="Select greenhouse" />
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs defaultValue="traps" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="traps">Pheromone Traps</TabsTrigger>
              <TabsTrigger value="scouting">Scouting</TabsTrigger>
            </TabsList>
            <TabsContent value="traps" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Trap #1</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="trap1-location">Location</Label>
                        <Input id="trap1-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="trap1-count">FCM Count</Label>
                        <Input id="trap1-count" type="number" placeholder="0" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Trap #2</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="trap2-location">Location</Label>
                        <Input id="trap2-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="trap2-count">FCM Count</Label>
                        <Input id="trap2-count" type="number" placeholder="0" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Trap #3</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="trap3-location">Location</Label>
                        <Input id="trap3-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="trap3-count">FCM Count</Label>
                        <Input id="trap3-count" type="number" placeholder="0" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Trap #4</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="trap4-location">Location</Label>
                        <Input id="trap4-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="trap4-count">FCM Count</Label>
                        <Input id="trap4-count" type="number" placeholder="0" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="trap-notes">Notes</Label>
                  <textarea
                    id="trap-notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    placeholder="Enter any additional observations or notes"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Save Trap Data</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="scouting" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Scouting Area 1</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="area1-location">Location</Label>
                        <Input id="area1-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="area1-findings">Findings</Label>
                        <textarea
                          id="area1-findings"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          placeholder="Describe any signs of FCM presence"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Scouting Area 2</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="area2-location">Location</Label>
                        <Input id="area2-location" placeholder="Enter location" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="area2-findings">Findings</Label>
                        <textarea
                          id="area2-findings"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          placeholder="Describe any signs of FCM presence"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="scouting-notes">General Notes</Label>
                  <textarea
                    id="scouting-notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    placeholder="Enter any additional observations or notes"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Save Scouting Data</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monitoring History</CardTitle>
          <CardDescription>View past monitoring records and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-500">No monitoring data available yet. Start recording data to see history.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
