import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Users,
  UserPlus,
  GraduationCap,
  Award,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Download,
  BookOpen,
  Video,
  AlertTriangle,
  MessageSquare,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data
const summaryCards = [
  { label: 'Total Users', value: '12,847', delta: 8.5, icon: Users, trend: 'up' as const },
  { label: 'Active Users (7d)', value: '5,234', delta: 12.3, icon: UserPlus, trend: 'up' as const },
  { label: 'Total Courses', value: '156', delta: 3.2, icon: GraduationCap, trend: 'up' as const },
  { label: 'Course Completions (30d)', value: '2,847', delta: 15.7, icon: Award, trend: 'up' as const },
  { label: 'Active Events', value: '23', delta: -2.1, icon: CalendarIcon, trend: 'down' as const },
  { label: 'Active Scholarships', value: '18', delta: 5.6, icon: Award, trend: 'up' as const },
  { label: 'Reels Published', value: '342', delta: 22.4, icon: Video, trend: 'up' as const },
  { label: 'Community Posts', value: '1,256', delta: 18.9, icon: MessageSquare, trend: 'up' as const },
];

const timeSeriesData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
  activeUsers: Math.floor(4500 + Math.random() * 1500),
  newSignups: Math.floor(150 + Math.random() * 100),
}));

const courseCompletionData = [
  { courseName: 'AI & Machine Learning', completionRate: 78, enrolled: 450, completed: 351 },
  { courseName: 'Business Leadership', completionRate: 85, enrolled: 380, completed: 323 },
  { courseName: 'Healthcare Diagnostics', completionRate: 72, enrolled: 290, completed: 209 },
  { courseName: 'Construction & Real Estate', completionRate: 68, enrolled: 220, completed: 150 },
  { courseName: 'Creativity & Arts', completionRate: 91, enrolled: 510, completed: 464 },
  { courseName: 'Business Informatics', completionRate: 76, enrolled: 340, completed: 258 },
  { courseName: 'Data Science', completionRate: 82, enrolled: 425, completed: 349 },
  { courseName: 'Web Development', completionRate: 89, enrolled: 560, completed: 498 },
];

const contentEngagementData = [
  { type: 'Video', value: 3450, color: 'hsl(var(--chart-1))' },
  { type: 'Notes', value: 2340, color: 'hsl(var(--chart-2))' },
  { type: 'Reels', value: 1890, color: 'hsl(var(--chart-3))' },
  { type: 'Posts', value: 1560, color: 'hsl(var(--chart-4))' },
  { type: 'Images', value: 980, color: 'hsl(var(--chart-5))' },
];

const topContent = [
  { id: '1', title: 'Introduction to Neural Networks', type: 'Video', views: 5234, completions: 4123 },
  { id: '2', title: 'Leadership in Crisis', type: 'Video', views: 4856, completions: 3945 },
  { id: '3', title: 'Quick Tips: Time Management', type: 'Reel', views: 8456, completions: 7234 },
  { id: '4', title: 'Study Guide: Data Structures', type: 'Notes', views: 3234, completions: 2890 },
  { id: '5', title: 'Career Growth Mindset', type: 'Post', views: 2945, completions: 2456 },
];

const upcomingEvents = [
  { id: '1', title: 'AI Hackathon 2024', type: 'Event', date: '2024-01-20', registrations: 234, capacity: 300 },
  { id: '2', title: 'Merit Scholarship Program', type: 'Scholarship', date: '2024-01-25', registrations: 156, capacity: 200 },
  { id: '3', title: 'Leadership Summit', type: 'Event', date: '2024-01-28', registrations: 445, capacity: 500 },
];

const learningFunnelData = [
  { stage: 'Enrolled', count: 12847, percentage: 100 },
  { stage: 'Started Modules', count: 9856, percentage: 76.7 },
  { stage: 'Completed Modules', count: 5234, percentage: 40.7 },
  { stage: 'Certified', count: 2847, percentage: 22.2 },
];

const geographyData = [
  { region: 'California', users: 2340 },
  { region: 'New York', users: 1856 },
  { region: 'Texas', users: 1645 },
  { region: 'Florida', users: 1234 },
  { region: 'Illinois', users: 987 },
  { region: 'Other', users: 4785 },
];

const alerts = [
  { id: '1', type: 'warning' as const, message: 'Low registrations for "Web Dev Workshop" (12/50)', timestamp: '2h ago' },
  { id: '2', type: 'error' as const, message: '3 courses have completion rate below 20%', timestamp: '4h ago' },
  { id: '3', type: 'info' as const, message: '45 community posts pending moderation', timestamp: '6h ago' },
];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedOrg, setSelectedOrg] = useState('all');

  const exportCSV = (widgetName: string) => {
    console.log(`Exporting ${widgetName} data as CSV`);
    // Mock export functionality
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="org1">Organization 1</SelectItem>
                <SelectItem value="org2">Organization 2</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {card.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(card.delta)}%
                      </span>
                      <span className="text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPI Strip */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">8,456</p>
              <p className="text-sm text-muted-foreground">MAU</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">5,234</p>
              <p className="text-sm text-muted-foreground">DAU</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12m 34s</p>
              <p className="text-sm text-muted-foreground">Avg Session</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">4.7</p>
              <p className="text-sm text-muted-foreground">Pages/Session</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">23.5%</p>
              <p className="text-sm text-muted-foreground">Bounce Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Activity Trends</CardTitle>
              <CardDescription>Daily active users and new signups over time</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportCSV('User Activity')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Active Users"
              />
              <Line
                type="monotone"
                dataKey="newSignups"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="New Signups"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Completion & Content Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Completion Rates</CardTitle>
                <CardDescription>Top courses by completion percentage</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV('Course Completion')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="courseName" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="completionRate" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => exportCSV('Content Engagement')}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentEngagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Most viewed and completed content pieces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">{content.type}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{content.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{content.completions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events & Scholarships</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.type}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {event.date}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Registrations</span>
                      <span className="font-medium">
                        {event.registrations} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Funnel & Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Funnel</CardTitle>
            <CardDescription>User progression through learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningFunnelData.map((stage, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Users by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={geographyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="region" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="users" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Operational Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Action Items</CardTitle>
          <CardDescription>Issues requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border',
                  alert.type === 'error' && 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
                  alert.type === 'warning' && 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950',
                  alert.type === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950'
                )}
              >
                <AlertTriangle
                  className={cn(
                    'w-5 h-5 mt-0.5',
                    alert.type === 'error' && 'text-red-600',
                    alert.type === 'warning' && 'text-yellow-600',
                    alert.type === 'info' && 'text-blue-600'
                  )}
                />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
