"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle2, Leaf, Shield, Thermometer } from "lucide-react"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function OverviewDashboard() {
  // State for summary stats
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const [diagnosisCount, setDiagnosisCount] = useState<number | null>(null);
  const [pinpoints, setPinpoints] = useState<number | null>(null);
  const [monitoringSessions, setMonitoringSessions] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // FCM Compliance Score: average of last 30 days compliance
      const { data: monitoring, error: mErr } = await supabase
        .from('fcm_monitoring')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      // Diagnosis count: this month
      const { data: diagnoses, error: dErr } = await supabase
        .from('diagnosis_results')
        .select('*')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
      // Pinpoints: FCM caught in last 30 days
      let pinpointCount = 0;
      if (monitoring) {
        monitoring.forEach((m) => {
          if (m.trap_data) {
            try {
              const traps = JSON.parse(m.trap_data);
              traps.forEach((t: any) => {
                pinpointCount += Number(t.count) || 0;
              });
            } catch {}
          }
        });
      }
      // Monitoring sessions: this month
      const { data: sessions, error: sErr } = await supabase
        .from('fcm_monitoring')
        .select('*')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
      // Compliance: completed/scheduled (assume 2 per week)
      let scheduled = 8; // 4 weeks * 2
      let completed = sessions ? sessions.length : 0;
      let compliance = scheduled ? Math.round((completed / scheduled) * 100) : 0;
      setComplianceScore(compliance);
      setDiagnosisCount(diagnoses ? diagnoses.length : 0);
      setPinpoints(pinpointCount);
      setMonitoringSessions(sessions ? sessions.length : 0);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCM Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : `${complianceScore ?? 0}%`}</div>
            <p className="text-xs text-gray-500">+5% from last month</p>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-green-600 h-1 rounded-full" style={{ width: `${complianceScore ?? 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disease Diagnoses</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : diagnosisCount ?? 0}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCM Pinpoints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : pinpoints ?? 0}</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : monitoringSessions ?? 0}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Leaf className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Avocado Disease Diagnosis</p>
                  <p className="text-sm text-gray-500">Anthracnose pinpointed with 92% confidence</p>
                  <p className="text-xs text-gray-400">Today, 10:24 AM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">FCM Monitoring Completed</p>
                  <p className="text-sm text-gray-500">Greenhouse A - No FCM pinpointed</p>
                  <p className="text-xs text-gray-400">Yesterday, 4:15 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Compliance Alert</p>
                  <p className="text-sm text-gray-500">Documentation incomplete for Greenhouse B</p>
                  <p className="text-xs text-gray-400">2 days ago, 9:30 AM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Corrective Action Completed</p>
                  <p className="text-sm text-gray-500">Greenhouse netting repairs verified</p>
                  <p className="text-xs text-gray-400">3 days ago, 2:45 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Environmental Conditions</CardTitle>
            <CardDescription>Current greenhouse conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Temperature</h3>
                  <Thermometer className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold">24.5°C</div>
                <p className="text-xs text-gray-500">Optimal range: 20-26°C</p>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Humidity</h3>
                  <svg
                    className="h-4 w-4 text-blue-500"
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
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                </div>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-gray-500">Optimal range: 60-80%</p>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Light Intensity</h3>
                  <svg
                    className="h-4 w-4 text-yellow-500"
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
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </div>
                <div className="text-2xl font-bold">12,500 lux</div>
                <p className="text-xs text-gray-500">Optimal range: 10,000-15,000 lux</p>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">CO₂ Level</h3>
                  <svg
                    className="h-4 w-4 text-gray-500"
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <div className="text-2xl font-bold">450 ppm</div>
                <p className="text-xs text-gray-500">Optimal range: 400-600 ppm</p>
                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-1 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
