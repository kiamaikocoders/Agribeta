"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
// import { PageBackground } from '@/components/page-background'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  Star,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function EarningsPage() {
  const { profile, agronomistProfile } = useAuth()
  const [timeRange, setTimeRange] = useState('month')
  const [earnings, setEarnings] = useState(null)

  // Mock earnings data
  const earningsData = {
    total: 2850,
    thisMonth: 1200,
    lastMonth: 1650,
    averagePerConsultation: 150,
    totalConsultations: 19,
    pendingPayments: 450,
    topClients: [
      { name: "John Doe", amount: 450, consultations: 3 },
      { name: "Sarah Kimani", amount: 300, consultations: 2 },
      { name: "Michael Ochieng", amount: 250, consultations: 2 }
    ],
    recentTransactions: [
      { id: 1, client: "John Doe", amount: 150, type: "Video Call", date: "2024-01-18", status: "Completed" },
      { id: 2, client: "Sarah Kimani", amount: 200, type: "Farm Visit", date: "2024-01-17", status: "Completed" },
      { id: 3, client: "Michael Ochieng", amount: 100, type: "Phone Consultation", date: "2024-01-16", status: "Pending" }
    ]
  }

  const monthlyEarnings = [
    { month: "Jan", amount: 1200 },
    { month: "Dec", amount: 1650 },
    { month: "Nov", amount: 1400 },
    { month: "Oct", amount: 1800 },
    { month: "Sep", amount: 1200 },
    { month: "Aug", amount: 1600 }
  ]

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-agribeta-green">Earnings & Analytics</h1>
            <p className="text-muted-foreground">Track your income and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-27%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. per Consultation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.averagePerConsultation}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                3 consultations pending
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="clients">Top Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                  <CardDescription>Your earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyEarnings.map((item, index) => (
                      <div key={item.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-agribeta-green h-2 rounded-full" 
                              style={{ width: `${(item.amount / 2000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">${item.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Clients */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Clients</CardTitle>
                  <CardDescription>Your highest earning clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earningsData.topClients.map((client, index) => (
                      <div key={client.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-agribeta-green/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-agribeta-green">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.consultations} consultations</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${client.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest earnings and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{transaction.client}</h4>
                          <p className="text-sm text-muted-foreground">{transaction.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${transaction.amount}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Performance</CardTitle>
                <CardDescription>Detailed breakdown of client earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.topClients.map((client, index) => (
                    <div key={client.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{client.name}</h4>
                        <span className="text-lg font-bold text-agribeta-green">${client.amount}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{client.consultations} consultations</span>
                        <span>Avg: ${Math.round(client.amount / client.consultations)} per session</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings by Service Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Video Calls</span>
                      <span className="font-medium">$900 (45%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Farm Visits</span>
                      <span className="font-medium">$1200 (40%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Phone Consultations</span>
                      <span className="font-medium">$750 (15%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Response Time</span>
                      <span className="font-medium text-green-600">2.5h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-medium text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Client Satisfaction</span>
                      <span className="font-medium text-green-600">4.6/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
