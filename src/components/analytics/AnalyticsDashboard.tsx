import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users, UserPlus, GraduationCap, Award, Calendar as CalendarIcon,
  TrendingUp, TrendingDown, Download, BookOpen, Video,
  AlertTriangle, MessageSquare, Eye, ThumbsUp, ExternalLink,
  ArrowRight, ClipboardList, Globe, FileText, UserCheck,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

// Platform-wide summary cards
const summaryCards = [
  { label: 'Total Users', value: '12,847', delta: 8.5, icon: Users, trend: 'up' as const, path: '/users' },
  { label: 'Active Applications', value: '1,456', delta: 14.2, icon: ClipboardList, trend: 'up' as const, path: '/interested-users' },
  { label: 'Total Courses', value: '156', delta: 3.2, icon: GraduationCap, trend: 'up' as const, path: '/courses' },
  { label: 'Universities', value: '42', delta: 5, icon: Globe, trend: 'up' as const, path: '/universities' },
  { label: 'Talent Pool Profiles', value: '8,920', delta: 12.8, icon: UserCheck, trend: 'up' as const, path: '/talent-pool' },
  { label: 'Acceptance Rate', value: '31%', delta: -1.5, trend: 'down' as const, icon: Award, path: '/reports' },
  { label: 'Avg Match Score', value: '69%', delta: 3.2, trend: 'up' as const, icon: TrendingUp, path: '/reports' },
  { label: 'Events Published', value: '67', delta: 8, trend: 'up' as const, icon: CalendarIcon, path: '/events' },
];

// KPI strip
const kpiData = [
  { label: 'MAU', value: '8,456' },
  { label: 'DAU', value: '5,234' },
  { label: 'Avg Session', value: '12m 34s' },
  { label: 'Pages/Session', value: '4.7' },
  { label: 'Bounce Rate', value: '23.5%' },
];

// Applications pipeline (aggregated across all universities)
const applicationsByStage = [
  { stage: "Submitted", count: 1456 },
  { stage: "Under Review", count: 1102 },
  { stage: "Shortlisted", count: 678 },
  { stage: "Interview", count: 412 },
  { stage: "Offer Sent", count: 289 },
  { stage: "Accepted", count: 198 },
  { stage: "Enrolled", count: 154 },
];

// Application trend
const applicationTrend = [
  { month: "Sep", applications: 320, accepted: 85 },
  { month: "Oct", applications: 445, accepted: 128 },
  { month: "Nov", applications: 560, accepted: 165 },
  { month: "Dec", applications: 390, accepted: 108 },
  { month: "Jan", applications: 680, accepted: 198 },
  { month: "Feb", applications: 810, accepted: 245 },
  { month: "Mar", applications: 620, accepted: 182 },
];

// Match score distribution
const matchScoreDistribution = [
  { range: "90-100%", count: 312 },
  { range: "80-89%", count: 548 },
  { range: "70-79%", count: 824 },
  { range: "60-69%", count: 612 },
  { range: "50-59%", count: 389 },
  { range: "Below 50%", count: 234 },
];

// Course applications (top courses across platform)
const courseApplications = [
  { course: "Computer Science MSc", applications: 412, shortlisted: 198, accepted: 86 },
  { course: "MBA Program", applications: 356, shortlisted: 178, accepted: 72 },
  { course: "Data Science MSc", applications: 289, shortlisted: 134, accepted: 58 },
  { course: "Engineering BSc", applications: 245, shortlisted: 112, accepted: 45 },
  { course: "Business Analytics", applications: 198, shortlisted: 89, accepted: 34 },
];

// Talent pool by region
const talentPoolByRegion = [
  { name: "Asia", value: 2890 },
  { name: "Europe", value: 2145 },
  { name: "Middle East", value: 1680 },
  { name: "Africa", value: 1245 },
  { name: "Americas", value: 960 },
];

// Top candidates
const topCandidates = [
  { name: "Rahul Sharma", score: 96, country: "India", program: "Computer Science MSc", university: "Oxford University", stage: "Shortlisted" },
  { name: "Emily Chen", score: 94, country: "China", program: "MBA Program", university: "Harvard Business School", stage: "Interview" },
  { name: "Ahmed Hassan", score: 91, country: "Egypt", program: "Data Science MSc", university: "MIT", stage: "Offer Sent" },
  { name: "Maria Garcia", score: 89, country: "Spain", program: "Business Analytics", university: "INSEAD", stage: "Under Review" },
  { name: "James Okafor", score: 87, country: "Nigeria", program: "Engineering BSc", university: "Cambridge", stage: "Shortlisted" },
];

// Engagement data
const engagementData = [
  { week: "W1", views: 8200, interactions: 2340, applications: 320 },
  { week: "W2", views: 9450, interactions: 2810, applications: 385 },
  { week: "W3", views: 7800, interactions: 2090, applications: 278 },
  { week: "W4", views: 11200, interactions: 3520, applications: 467 },
  { week: "W5", views: 9320, interactions: 2780, applications: 348 },
  { week: "W6", views: 12890, interactions: 4210, applications: 512 },
];

// Community stats
const communityStats = [
  { type: "Community Posts", count: 342 },
  { type: "Wall Posts", count: 228 },
  { type: "Reels", count: 115 },
  { type: "Events", count: 67 },
  { type: "Scholarships", count: 45 },
];

// Time series
const timeSeriesData = Array.from({ length: 30 }, (_, i) => ({
  date: format(new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
  activeUsers: Math.floor(4500 + Math.random() * 1500),
  newSignups: Math.floor(150 + Math.random() * 100),
}));

// Course completion
const courseCompletionData = [
  { courseName: 'AI & Machine Learning', completionRate: 78, enrolled: 450, completed: 351 },
  { courseName: 'Business Leadership', completionRate: 85, enrolled: 380, completed: 323 },
  { courseName: 'Healthcare Diagnostics', completionRate: 72, enrolled: 290, completed: 209 },
  { courseName: 'Construction & Real Estate', completionRate: 68, enrolled: 220, completed: 150 },
  { courseName: 'Creativity & Arts', completionRate: 91, enrolled: 510, completed: 464 },
];

// Content engagement
const contentEngagementData = [
  { type: 'Video', value: 3450, color: 'hsl(var(--chart-1))' },
  { type: 'Notes', value: 2340, color: 'hsl(var(--chart-2))' },
  { type: 'Reels', value: 1890, color: 'hsl(var(--chart-3))' },
  { type: 'Posts', value: 1560, color: 'hsl(var(--chart-4))' },
  { type: 'Images', value: 980, color: 'hsl(var(--chart-5))' },
];

// Learning funnel
const learningFunnelData = [
  { stage: 'Enrolled', count: 12847, percentage: 100 },
  { stage: 'Started Modules', count: 9856, percentage: 76.7 },
  { stage: 'Completed Modules', count: 5234, percentage: 40.7 },
  { stage: 'Certified', count: 2847, percentage: 22.2 },
];

// Alerts
const alerts = [
  { id: '1', type: 'warning' as const, message: '3 universities have pending application reviews > 7 days', timestamp: '2h ago' },
  { id: '2', type: 'error' as const, message: '5 courses across 2 universities have completion rate below 20%', timestamp: '4h ago' },
  { id: '3', type: 'info' as const, message: '45 community posts pending moderation', timestamp: '6h ago' },
  { id: '4', type: 'warning' as const, message: 'Talent pool import from 2 universities failed validation', timestamp: '8h ago' },
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
};

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clickable Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
              onClick={() => navigate(card.path)}
            >
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <Badge variant={card.trend === "up" ? "default" : "destructive"} className="text-xs px-1.5 py-0">
                    {card.trend === "up" ? "+" : ""}{card.delta}%
                  </Badge>
                </div>
                <p className="text-xl font-bold">{card.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground leading-tight">{card.label}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
            {kpiData.map((kpi) => (
              <div key={kpi.label} className="text-center">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed sections like university analytics */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="talent">Talent Pool</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="platform">Platform Activity</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Application Pipeline (All Universities)</CardTitle>
                  <CardDescription>Aggregated applications by processing stage</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/interested-users")}>
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationsByStage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  {applicationsByStage.map((s) => (
                    <Badge key={s.stage} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {s.stage}: {s.count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Application Trend</CardTitle>
                  <CardDescription>Monthly applications vs accepted across platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/reports")}>
                  Full Report <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={applicationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="applications" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="accepted" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Match Score Distribution</CardTitle>
                  <CardDescription>How applicants score against selection criteria</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={matchScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Top Candidates by Match Score</CardTitle>
                  <CardDescription>Highest scoring applicants across all universities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/talent-pool")}>
                  Talent Pool <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCandidates.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.program} • {c.university}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{c.stage}</Badge>
                        <span className="text-lg font-bold text-primary">{c.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Applications by Course</CardTitle>
                  <CardDescription>Top courses by application volume across platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/courses")}>
                  Manage Courses <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={courseApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="shortlisted" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="accepted" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 pt-3 border-t space-y-2">
                  {courseApplications.map((c) => (
                    <div key={c.course} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/courses")}>
                      <span className="text-sm font-medium">{c.course}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{c.applications} applied</span>
                        <span>{c.shortlisted} shortlisted</span>
                        <span className="text-primary font-medium">{c.accepted} accepted</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Completion Rates</CardTitle>
                <CardDescription>Top courses by completion percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={courseCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="courseName" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="completionRate" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Talent Pool Tab */}
        <TabsContent value="talent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Talent Pool by Region</CardTitle>
                  <CardDescription>Geographic distribution across all universities</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/talent-pool")}>
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={talentPoolByRegion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {talentPoolByRegion.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  {talentPoolByRegion.map((r) => (
                    <Badge key={r.name} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {r.name}: {r.value.toLocaleString()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Learning Funnel</CardTitle>
                <CardDescription>User progression through learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningFunnelData.map((stage, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-muted-foreground">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${stage.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Engagement Trend</CardTitle>
                <CardDescription>Weekly views, interactions & applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="interactions" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="applications" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Engagement</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={contentEngagementData} cx="50%" cy="50%" labelLine={false}
                      label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100} dataKey="value">
                      {contentEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Community & Content Stats</CardTitle>
                <CardDescription>Published content across platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={communityStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Activity Tab */}
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Activity Trends</CardTitle>
                  <CardDescription>Daily active users and new signups over time</CardDescription>
                </div>
                <Button variant="outline" size="sm">
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="activeUsers" stroke="hsl(var(--primary))" strokeWidth={2} name="Active Users" />
                  <Line type="monotone" dataKey="newSignups" stroke="hsl(var(--chart-2))" strokeWidth={2} name="New Signups" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Action Items</CardTitle>
          <CardDescription>Issues requiring attention across platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border',
                  alert.type === 'error' && 'border-destructive/30 bg-destructive/5',
                  alert.type === 'warning' && 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
                  alert.type === 'info' && 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                )}
              >
                <AlertTriangle className={cn('w-5 h-5 mt-0.5',
                  alert.type === 'error' && 'text-destructive',
                  alert.type === 'warning' && 'text-orange-600',
                  alert.type === 'info' && 'text-blue-600'
                )} />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
