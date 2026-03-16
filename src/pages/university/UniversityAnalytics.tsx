import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import {
  BookOpen, Users, FileText, TrendingUp,
  UserCheck, ClipboardList, Globe, Award, Calendar, ExternalLink, ArrowRight
} from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const summaryCards = [
  { label: "Total Courses", value: 24, delta: 3, trend: "up" as const, icon: BookOpen, path: "/university/courses" },
  { label: "Active Applications", value: 187, delta: 12, trend: "up" as const, icon: ClipboardList, path: "/university/applications" },
  { label: "Talent Pool Profiles", value: 1_245, delta: 89, trend: "up" as const, icon: Users, path: "/university/talent-pool" },
  { label: "Acceptance Rate", value: "34%", delta: -2, trend: "down" as const, icon: Award, path: "/university/applications-overview" },
  { label: "Avg Match Score", value: "72%", delta: 5, trend: "up" as const, icon: TrendingUp, path: "/university/application-process-list" },
  { label: "Events Published", value: 8, delta: 2, trend: "up" as const, icon: Calendar, path: "/university/content" },
];

const applicationsByStage = [
  { stage: "Submitted", count: 187, path: "/university/applications" },
  { stage: "Under Review", count: 142, path: "/university/applications" },
  { stage: "Shortlisted", count: 89, path: "/university/applications" },
  { stage: "Interview", count: 56, path: "/university/applications" },
  { stage: "Offer Sent", count: 38, path: "/university/applications" },
  { stage: "Accepted", count: 28, path: "/university/applications" },
  { stage: "Enrolled", count: 22, path: "/university/applications" },
];

const applicationTrend = [
  { month: "Sep", applications: 45, accepted: 12 },
  { month: "Oct", applications: 62, accepted: 18 },
  { month: "Nov", applications: 78, accepted: 22 },
  { month: "Dec", applications: 55, accepted: 15 },
  { month: "Jan", applications: 92, accepted: 28 },
  { month: "Feb", applications: 110, accepted: 34 },
  { month: "Mar", applications: 87, accepted: 26 },
];

const courseApplications = [
  { course: "Computer Science MSc", applications: 68, shortlisted: 32, accepted: 14 },
  { course: "MBA Program", applications: 52, shortlisted: 28, accepted: 12 },
  { course: "Data Science MSc", applications: 41, shortlisted: 18, accepted: 8 },
  { course: "Engineering BSc", applications: 35, shortlisted: 15, accepted: 6 },
  { course: "Business Analytics", applications: 28, shortlisted: 12, accepted: 5 },
];

const talentPoolByRegion = [
  { name: "Asia", value: 420 },
  { name: "Europe", value: 310 },
  { name: "Middle East", value: 245 },
  { name: "Africa", value: 165 },
  { name: "Americas", value: 105 },
];

const matchScoreDistribution = [
  { range: "90-100%", count: 45 },
  { range: "80-89%", count: 78 },
  { range: "70-79%", count: 112 },
  { range: "60-69%", count: 89 },
  { range: "50-59%", count: 56 },
  { range: "Below 50%", count: 34 },
];

const engagementData = [
  { week: "W1", views: 1200, interactions: 340, applications: 45 },
  { week: "W2", views: 1450, interactions: 410, applications: 52 },
  { week: "W3", views: 1100, interactions: 290, applications: 38 },
  { week: "W4", views: 1680, interactions: 520, applications: 67 },
  { week: "W5", views: 1320, interactions: 380, applications: 48 },
  { week: "W6", views: 1890, interactions: 610, applications: 72 },
];

const communityStats = [
  { type: "Community Posts", count: 42 },
  { type: "Wall Posts", count: 28 },
  { type: "Reels", count: 15 },
  { type: "Events", count: 8 },
  { type: "Scholarships", count: 5 },
];

const topCandidates = [
  { name: "Rahul Sharma", score: 96, country: "India", program: "Computer Science MSc", stage: "Shortlisted" },
  { name: "Emily Chen", score: 94, country: "China", program: "MBA Program", stage: "Interview" },
  { name: "Ahmed Hassan", score: 91, country: "Egypt", program: "Data Science MSc", stage: "Offer Sent" },
  { name: "Maria Garcia", score: 89, country: "Spain", program: "Business Analytics", stage: "Under Review" },
  { name: "James Okafor", score: 87, country: "Nigeria", program: "Engineering BSc", stage: "Shortlisted" },
];

const UniversityAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("6months");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track performance across courses, applications, talent pool & engagement
          </p>
        </div>
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
      </div>

      {/* Clickable Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
            onClick={() => navigate(card.path)}
          >
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <Badge variant={card.trend === "up" ? "default" : "destructive"} className="text-xs px-1.5 py-0">
                  {card.trend === "up" ? "+" : ""}{card.delta}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="talent">Talent Pool</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Application Pipeline</CardTitle>
                  <CardDescription>Applications by processing stage</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/applications-overview")}>
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={applicationsByStage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                      cursor="pointer"
                      onClick={(data: any) => navigate("/university/applications")}
                    />
                  </BarChart>
                </ResponsiveContainer>
                {/* Stage quick links */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  {applicationsByStage.map((s) => (
                    <Badge
                      key={s.stage}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => navigate("/university/applications")}
                    >
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
                  <CardDescription>Monthly applications vs accepted</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/reports")}>
                  Full Report <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={applicationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/application-process-list")}>
                  Criteria <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={matchScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} cursor="pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Candidates quick view */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Top Candidates by Match Score</CardTitle>
                  <CardDescription>Highest scoring applicants across programs</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/talent-pool")}>
                  Talent Pool <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCandidates.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate("/university/talent-pool")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.program} • {c.country}</p>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Applications by Course</CardTitle>
                <CardDescription>Breakdown of applications, shortlisted, and accepted per course</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/university/courses")}>
                Manage Courses <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={courseApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} cursor="pointer" />
                  <Bar dataKey="shortlisted" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} cursor="pointer" />
                  <Bar dataKey="accepted" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
              {/* Course quick links */}
              <div className="mt-4 pt-3 border-t space-y-2">
                {courseApplications.map((c) => (
                  <div
                    key={c.course}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate("/university/courses")}
                  >
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
        </TabsContent>

        {/* Talent Pool Tab */}
        <TabsContent value="talent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Talent Pool by Region</CardTitle>
                  <CardDescription>Geographic distribution of candidates</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/talent-pool")}>
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
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                {/* Region quick links */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  {talentPoolByRegion.map((r, i) => (
                    <Badge
                      key={r.name}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => navigate("/university/talent-pool")}
                    >
                      <Globe className="h-3 w-3 mr-1" /> {r.name}: {r.value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Candidate Quality</CardTitle>
                  <CardDescription>Profile completeness & match score overview</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/talent-pool")}>
                  Talent Pool <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {[
                  { label: "Complete Profiles", value: 876, total: 1245, color: "bg-primary", path: "/university/talent-pool" },
                  { label: "Verified Documents", value: 623, total: 1245, color: "bg-chart-2", path: "/university/talent-pool" },
                  { label: "Match Score > 70%", value: 235, total: 414, color: "bg-chart-3", path: "/university/applications" },
                  { label: "Shortlisted", value: 89, total: 414, color: "bg-chart-4", path: "/university/applications" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1">
                        {item.label}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </span>
                      <span className="text-muted-foreground">{item.value}/{item.total}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.value / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Weekly Engagement</CardTitle>
                  <CardDescription>Views, interactions & applications over time</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/reports")}>
                  Full Report <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="interactions" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="applications" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Content Published</CardTitle>
                  <CardDescription>Content breakdown by type</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/university/content")}>
                  Manage Content <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={communityStats} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} label>
                      {communityStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                {/* Content type quick links */}
                <div className="mt-3 pt-3 border-t space-y-1">
                  {communityStats.map((c) => (
                    <div
                      key={c.type}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate("/university/content")}
                    >
                      <span className="text-sm">{c.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{c.count}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityAnalytics;
