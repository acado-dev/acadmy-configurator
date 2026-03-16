import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Filter, Search, Calendar, BarChart, Users, BookOpen, ClipboardList, Award, TrendingUp, Eye, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
  lastGenerated?: string;
}

const reportTemplates: ReportTemplate[] = [
  { id: "1", name: "Application Summary Report", description: "Overview of all applications with status, match scores, and stage progression", category: "applications", icon: ClipboardList, lastGenerated: "2026-03-14" },
  { id: "2", name: "Course Performance Report", description: "Application metrics per course including conversion rates and enrollment numbers", category: "courses", icon: BookOpen, lastGenerated: "2026-03-12" },
  { id: "3", name: "Selection Pipeline Report", description: "Detailed breakdown of applications across all selection stages with timelines", category: "applications", icon: Filter, lastGenerated: "2026-03-10" },
  { id: "4", name: "Talent Pool Analysis", description: "Candidate demographics, qualifications, match scores, and regional distribution", category: "talent", icon: Users },
  { id: "5", name: "Acceptance & Enrollment Report", description: "Offer letters sent, acceptance rates, and final enrollment statistics", category: "applications", icon: Award, lastGenerated: "2026-03-08" },
  { id: "6", name: "Match Score Analysis", description: "Distribution of match scores across criteria with top-scoring candidate profiles", category: "applications", icon: TrendingUp },
  { id: "7", name: "Engagement & Content Report", description: "Community posts, wall activity, reels views, and event registrations", category: "engagement", icon: BarChart },
  { id: "8", name: "Event & Scholarship Report", description: "Event attendance, scholarship applications, and award distribution", category: "engagement", icon: Calendar },
];

// Mock generated reports
const generatedReports = [
  { id: "r1", name: "Application Summary - March 2026", template: "Application Summary Report", generatedAt: "2026-03-14 14:30", format: "PDF", size: "2.4 MB", status: "ready" },
  { id: "r2", name: "Course Performance Q1 2026", template: "Course Performance Report", generatedAt: "2026-03-12 09:15", format: "Excel", size: "1.8 MB", status: "ready" },
  { id: "r3", name: "Selection Pipeline - Feb 2026", template: "Selection Pipeline Report", generatedAt: "2026-03-10 16:45", format: "PDF", size: "3.1 MB", status: "ready" },
  { id: "r4", name: "Acceptance Report - Winter Intake", template: "Acceptance & Enrollment Report", generatedAt: "2026-03-08 11:20", format: "Excel", size: "1.2 MB", status: "ready" },
];

// Mock detailed application data for table
const applicationReportData = [
  { id: "APP-001", applicant: "Ahmed Al-Rashid", course: "Computer Science MSc", stage: "Offer Sent", matchScore: 92, submittedDate: "2026-01-15", lastUpdated: "2026-03-12" },
  { id: "APP-002", applicant: "Sarah Chen", course: "MBA Program", stage: "Shortlisted", matchScore: 87, submittedDate: "2026-01-22", lastUpdated: "2026-03-10" },
  { id: "APP-003", applicant: "Priya Sharma", course: "Data Science MSc", stage: "Interview", matchScore: 84, submittedDate: "2026-02-01", lastUpdated: "2026-03-11" },
  { id: "APP-004", applicant: "James Okonkwo", course: "Engineering BSc", stage: "Under Review", matchScore: 76, submittedDate: "2026-02-10", lastUpdated: "2026-03-09" },
  { id: "APP-005", applicant: "Maria Garcia", course: "Business Analytics", stage: "Accepted", matchScore: 91, submittedDate: "2026-01-05", lastUpdated: "2026-03-14" },
  { id: "APP-006", applicant: "Li Wei", course: "Computer Science MSc", stage: "Submitted", matchScore: 68, submittedDate: "2026-03-01", lastUpdated: "2026-03-01" },
  { id: "APP-007", applicant: "Fatima Al-Sayed", course: "MBA Program", stage: "Enrolled", matchScore: 95, submittedDate: "2025-12-20", lastUpdated: "2026-03-13" },
];

const stageColors: Record<string, string> = {
  "Submitted": "bg-muted text-muted-foreground",
  "Under Review": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Shortlisted": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Interview": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Offer Sent": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "Accepted": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Enrolled": "bg-primary/10 text-primary",
};

const UniversityReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university' : '';

  const filteredTemplates = reportTemplates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewReport = (template: ReportTemplate) => {
    navigate(`${basePath}/reports/${template.id}`);
  };

  const handleDownload = (reportName: string) => {
    toast({
      title: "Downloading",
      description: `Downloading "${reportName}"...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate and download detailed reports across all workflows
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="applications">Application Data</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="talent">Talent Pool</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs capitalize">{template.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    {template.lastGenerated && (
                      <span className="text-xs text-muted-foreground">Last: {template.lastGenerated}</span>
                    )}
                    <Button size="sm" onClick={() => handleViewReport(template)} className="ml-auto">
                      <Eye className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Generated Reports Tab */}
        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reports</CardTitle>
              <CardDescription>Previously generated reports ready for download</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell className="text-muted-foreground">{report.template}</TableCell>
                      <TableCell className="text-muted-foreground">{report.generatedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.format}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{report.size}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(report.name)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Data Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Application Data Export</CardTitle>
                  <CardDescription>View and export application data with filters</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDownload("Application Data Export")}>
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationReportData.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-mono text-xs">{app.id}</TableCell>
                      <TableCell className="font-medium">{app.applicant}</TableCell>
                      <TableCell>{app.course}</TableCell>
                      <TableCell>
                        <Badge className={stageColors[app.stage] || ""} variant="secondary">
                          {app.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={app.matchScore >= 80 ? "text-green-600 font-semibold" : app.matchScore >= 60 ? "text-amber-600" : "text-muted-foreground"}>
                          {app.matchScore}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{app.submittedDate}</TableCell>
                      <TableCell className="text-muted-foreground">{app.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityReports;
