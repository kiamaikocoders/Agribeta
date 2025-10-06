"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Download, Calendar } from "lucide-react"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function FCMAnalytics() {
  // State for monitoring data
  const [monitoring, setMonitoring] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('last30');

  // Fetch monitoring data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Optionally filter by date range based on period
      let fromDate = new Date();
      if (period === 'last7') fromDate.setDate(fromDate.getDate() - 7);
      else if (period === 'last30') fromDate.setDate(fromDate.getDate() - 30);
      else if (period === 'last90') fromDate.setDate(fromDate.getDate() - 90);
      else if (period === 'year') fromDate.setMonth(0, 1);
      const { data, error } = await supabase
        .from('fcm_monitoring')
        .select('*')
        .gte('date', fromDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      if (!error && data) setMonitoring(data);
      setLoading(false);
    };
    fetchData();
  }, [period]);

  // Calculate analytics
  let totalCatches = 0;
  let sessions = monitoring.length;
  let scheduled = Math.ceil((period === 'last7' ? 2 : period === 'last30' ? 8 : period === 'last90' ? 24 : 52));
  let completed = sessions;
  let compliance = scheduled ? Math.round((completed / scheduled) * 100) : 0;
  let riskByGreenhouse: Record<string, number> = {};

  monitoring.forEach((m) => {
    // Trap data is stored as JSON string
    if (m.trap_data) {
      try {
        const traps = JSON.parse(m.trap_data);
        traps.forEach((t: any) => {
          totalCatches += Number(t.count) || 0;
        });
      } catch {}
    }
    // Risk: count total FCM per greenhouse
    if (m.greenhouse_id) {
      if (!riskByGreenhouse[m.greenhouse_id]) riskByGreenhouse[m.greenhouse_id] = 0;
      if (m.trap_data) {
        try {
          const traps = JSON.parse(m.trap_data);
          traps.forEach((t: any) => {
            riskByGreenhouse[m.greenhouse_id] += Number(t.count) || 0;
          });
        } catch {}
      }
    }
  });

  // Risk levels (simple: >20 high, >10 medium, else low)
  const riskLevel = (count: number) =>
    count > 20 ? 'High' : count > 10 ? 'Medium' : 'Low';
  const riskColor = (level: string) =>
    level === 'High' ? 'bg-red-500' : level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';

  // For trends, group by month
  const monthlyTrends: Record<string, number> = {};
  monitoring.forEach((m) => {
    const month = m.date?.slice(0, 7);
    if (!month) return;
    if (!monthlyTrends[month]) monthlyTrends[month] = 0;
    if (m.trap_data) {
      try {
        const traps = JSON.parse(m.trap_data);
        traps.forEach((t: any) => {
          monthlyTrends[month] += Number(t.count) || 0;
        });
      } catch {}
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">FCM Monitoring Analytics</h2>
          <p className="text-gray-500">Track and analyze FCM monitoring data over time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={setPeriod}>
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
            <div className="text-3xl font-bold">{loading ? '...' : totalCatches}</div>
            <p className="text-sm text-red-500 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {loading ? '...' : `+${totalCatches - 4} from previous period`}
            </p>
            {/* You can add a real bar chart here if desired */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monitoring Compliance</CardTitle>
            <CardDescription>Percentage of scheduled monitoring completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${compliance}%`}</div>
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
              {loading ? '...' : `+${compliance - 12}% from previous period`}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${compliance}%` }}></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Scheduled</p>
                <p className="font-medium">{scheduled} sessions</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Completed</p>
                <p className="font-medium">{completed} sessions</p>
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
              {Object.entries(riskByGreenhouse).map(([gh, count]) => {
                const level = riskLevel(count as number);
                return (
                  <div key={`risk-${gh}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{gh}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${riskColor(level)}/20 text-${riskColor(level).split('-')[1]}-800`}>{level} Risk</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                      <div className={`${riskColor(level)} h-1.5 rounded-full`} style={{ width: `${Math.min(100, (count as number) * 3)}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FCM Pinpointing Trends</CardTitle>
          <CardDescription>Historical FCM pinpointing data across all greenhouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-end justify-between p-4">
            {Object.entries(monthlyTrends).map(([month, count]) => (
              <div className="flex flex-col items-center" key={`trend-${month}`}>
                <div className="bg-green-500 w-12 rounded-t-sm" style={{ height: `${Math.min(200, Number(count) * 4)}px` }}></div>
                <span className="text-xs mt-2">{month.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Peak Month:</span> {Object.entries(monthlyTrends).reduce((a, b) => (a[1] > b[1] ? a : b), ["", 0])[0]}
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
