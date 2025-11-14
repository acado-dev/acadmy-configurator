import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BarChart3, FileText, Users } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import ReportsTab from '@/components/analytics/ReportsTab';
import InterestedUsersTab from '@/components/analytics/InterestedUsersTab';

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights across courses, events, scholarships, and user engagement
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Card className="border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="interested-users"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
              >
                <Users className="w-4 h-4 mr-2" />
                Interested Users
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsDashboard />
              </TabsContent>

              <TabsContent value="reports" className="mt-0">
                <ReportsTab />
              </TabsContent>

              <TabsContent value="interested-users" className="mt-0">
                <InterestedUsersTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
