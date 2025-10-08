"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function FCMCompliance() {
  // State for compliance data
  const [compliance, setCompliance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('fcm_compliance').select('*').order('created_at', { ascending: false }).limit(1);
      if (!error && data && data.length > 0) setCompliance(data[0]);
      setLoading(false);
    };
    fetchCompliance();
  }, []);

  if (loading) return <div>Loading compliance data...</div>;
  if (!compliance) return <div className="text-gray-500">No compliance data found.</div>;

  // Example: checklist is stored as JSON in the DB
  const checklist = compliance.checklist || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Checklist</CardTitle>
          <CardDescription>Track your compliance with EU regulations for FCM management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Greenhouse Structure</h3>
                <Badge variant="outline" className="bg-green-50">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Compliant
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>Polythene covers intact</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>T7-20 mesh netting installed</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>Double-door systems functional</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Monitoring Protocol</h3>
                <Badge variant="outline" className="bg-yellow-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Partial
                </Badge>
              </div>
              <Progress value={60} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>Pheromone traps installed</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span>Bi-weekly monitoring incomplete</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>Scouting records maintained</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Documentation</h3>
                <Badge variant="outline" className="bg-red-50">
                  <XCircle className="h-3 w-3 mr-1" />
                  Non-compliant
                </Badge>
              </div>
              <Progress value={30} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span>Incomplete monitoring records</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span>Missing treatment logs</span>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <span>Facility registration complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>Generate Compliance Report</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Corrective Action Protocol</CardTitle>
          <CardDescription>Steps to take if FCM is pinpointed in your facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full p-2 mr-4">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium">Halt Exports</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Immediately stop all exports from the affected greenhouse until the issue is resolved.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2 mr-4">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium">Increase Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Implement daily trapping and scouting for at least 5 consecutive days to assess the extent of
                  infestation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-4">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium">Apply Treatments</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use approved pesticides according to label rates and implement biological controls as appropriate.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-full p-2 mr-4">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="font-medium">Verify Effectiveness</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Continue monitoring until no FCM is pinpointed for at least 14 consecutive days before resuming exports.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
