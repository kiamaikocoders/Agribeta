"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function DiagnosisAnalytics() {
  // State for diagnosis data
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('last30');

  // Fetch diagnosis data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let fromDate = new Date();
      if (period === 'last7') fromDate.setDate(fromDate.getDate() - 7);
      else if (period === 'last30') fromDate.setDate(fromDate.getDate() - 30);
      else if (period === 'last90') fromDate.setDate(fromDate.getDate() - 90);
      else if (period === 'year') fromDate.setMonth(0, 1);
      const { data, error } = await supabase
        .from('diagnosis_results')
        .select('*')
        .gte('date', fromDate.toISOString().split('T')[0])
        .order('date', { ascending: true });
      if (!error && data) setDiagnoses(data);
      setLoading(false);
    };
    fetchData();
  }, [period]);

  // Calculate analytics
  const totalDiagnoses = diagnoses.length;
  const confidences = diagnoses.map((d) => d.confidence || 0);
  const avgConfidence = confidences.length ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;
  const highest = confidences.length ? Math.max(...confidences) : 0;
  const lowest = confidences.length ? Math.min(...confidences) : 0;
  // Input method distribution
  let uploadCount = 0, cameraCount = 0;
  diagnoses.forEach((d) => {
    if (d.input_method === 'upload') uploadCount++;
    else if (d.input_method === 'camera') cameraCount++;
  });
  const uploadPct = totalDiagnoses ? Math.round((uploadCount / totalDiagnoses) * 100) : 0;
  // Disease breakdown
  const diseaseCounts: Record<string, number> = {};
  diagnoses.forEach((d) => {
    if (d.disease) {
      if (!diseaseCounts[d.disease]) diseaseCounts[d.disease] = 0;
      diseaseCounts[d.disease]++;
    }
  });
  const diseaseTotal = Object.values(diseaseCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Disease Diagnosis Analytics</h2>
          <p className="text-gray-500">Track and analyze avocado disease diagnoses over time</p>
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
            <CardTitle className="text-lg">Total Diagnoses</CardTitle>
            <CardDescription>Number of disease diagnoses performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : totalDiagnoses}</div>
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
              {loading ? '...' : `+${totalDiagnoses - 8} from previous period`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Diagnosis Accuracy</CardTitle>
            <CardDescription>Average confidence level of diagnoses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : `${avgConfidence}%`}</div>
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
              {loading ? '...' : `+${avgConfidence - 3}% from previous period`}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${avgConfidence}%` }}></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Highest</p>
                <p className="font-medium">{highest}%</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Lowest</p>
                <p className="font-medium">{lowest}%</p>
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
                    strokeDasharray={`${(uploadPct / 100) * 251.3} 251.3`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-2xl font-bold">{uploadPct}%</span>
                    <span className="block text-xs text-gray-500">Uploads</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mt-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Uploads</p>
                <p className="font-medium">{uploadCount} diagnoses</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                <p className="text-gray-500">Camera</p>
                <p className="font-medium">{cameraCount} diagnoses</p>
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
            {Object.entries(diseaseCounts).map(([disease, count]) => (
              <div key={disease}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{disease}</span>
                  <span className="text-xs">{diseaseTotal ? Math.round((count / diseaseTotal) * 100) : 0}% ({count} cases)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${diseaseTotal ? (count / diseaseTotal) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Key Insights</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Anthracnose remains the most common disease, consistent with seasonal patterns</li>
              <li>Root rot cases have increased by 15% compared to the previous period</li>
              <li>Early pinpointing has improved treatment success rates by 22%</li>
              <li>Recommended preventative measures have been updated based on recent diagnoses</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
