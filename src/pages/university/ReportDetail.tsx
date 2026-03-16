import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, FileSpreadsheet, FileText, Search, Filter, Printer, SortAsc, SortDesc } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Report data definitions by report ID
const reportDataMap: Record<string, { title: string; description: string; columns: { key: string; label: string }[]; data: Record<string, any>[] }> = {
  '1': {
    title: 'Application Summary Report',
    description: 'Overview of all applications with status, match scores, and stage progression',
    columns: [
      { key: 'id', label: 'Application ID' },
      { key: 'applicant', label: 'Applicant' },
      { key: 'email', label: 'Email' },
      { key: 'course', label: 'Course' },
      { key: 'stage', label: 'Stage' },
      { key: 'matchScore', label: 'Match Score' },
      { key: 'submittedDate', label: 'Submitted' },
      { key: 'lastUpdated', label: 'Last Updated' },
    ],
    data: [
      { id: 'APP-001', applicant: 'Ahmed Al-Rashid', email: 'ahmed@email.com', course: 'Computer Science MSc', stage: 'Offer Sent', matchScore: 92, submittedDate: '2026-01-15', lastUpdated: '2026-03-12' },
      { id: 'APP-002', applicant: 'Sarah Chen', email: 'sarah.c@email.com', course: 'MBA Program', stage: 'Shortlisted', matchScore: 87, submittedDate: '2026-01-22', lastUpdated: '2026-03-10' },
      { id: 'APP-003', applicant: 'Priya Sharma', email: 'priya.s@email.com', course: 'Data Science MSc', stage: 'Interview', matchScore: 84, submittedDate: '2026-02-01', lastUpdated: '2026-03-11' },
      { id: 'APP-004', applicant: 'James Okonkwo', email: 'james.o@email.com', course: 'Engineering BSc', stage: 'Under Review', matchScore: 76, submittedDate: '2026-02-10', lastUpdated: '2026-03-09' },
      { id: 'APP-005', applicant: 'Maria Garcia', email: 'maria.g@email.com', course: 'Business Analytics', stage: 'Accepted', matchScore: 91, submittedDate: '2026-01-05', lastUpdated: '2026-03-14' },
      { id: 'APP-006', applicant: 'Li Wei', email: 'li.w@email.com', course: 'Computer Science MSc', stage: 'Submitted', matchScore: 68, submittedDate: '2026-03-01', lastUpdated: '2026-03-01' },
      { id: 'APP-007', applicant: 'Fatima Al-Sayed', email: 'fatima@email.com', course: 'MBA Program', stage: 'Enrolled', matchScore: 95, submittedDate: '2025-12-20', lastUpdated: '2026-03-13' },
      { id: 'APP-008', applicant: 'Carlos Rodriguez', email: 'carlos.r@email.com', course: 'Data Science MSc', stage: 'Shortlisted', matchScore: 82, submittedDate: '2026-02-05', lastUpdated: '2026-03-10' },
      { id: 'APP-009', applicant: 'Yuki Tanaka', email: 'yuki.t@email.com', course: 'Computer Science MSc', stage: 'Offer Sent', matchScore: 89, submittedDate: '2026-01-18', lastUpdated: '2026-03-14' },
      { id: 'APP-010', applicant: 'Anna Kowalski', email: 'anna.k@email.com', course: 'Engineering BSc', stage: 'Under Review', matchScore: 71, submittedDate: '2026-02-20', lastUpdated: '2026-03-08' },
    ],
  },
  '2': {
    title: 'Course Performance Report',
    description: 'Application metrics per course including conversion rates and enrollment numbers',
    columns: [
      { key: 'course', label: 'Course Name' },
      { key: 'totalApplications', label: 'Total Applications' },
      { key: 'shortlisted', label: 'Shortlisted' },
      { key: 'interviewed', label: 'Interviewed' },
      { key: 'offered', label: 'Offers Made' },
      { key: 'accepted', label: 'Accepted' },
      { key: 'enrolled', label: 'Enrolled' },
      { key: 'conversionRate', label: 'Conversion Rate' },
    ],
    data: [
      { course: 'Computer Science MSc', totalApplications: 145, shortlisted: 82, interviewed: 56, offered: 38, accepted: 30, enrolled: 25, conversionRate: '17.2%' },
      { course: 'MBA Program', totalApplications: 120, shortlisted: 68, interviewed: 45, offered: 32, accepted: 28, enrolled: 22, conversionRate: '18.3%' },
      { course: 'Data Science MSc', totalApplications: 98, shortlisted: 55, interviewed: 38, offered: 25, accepted: 20, enrolled: 16, conversionRate: '16.3%' },
      { course: 'Engineering BSc', totalApplications: 87, shortlisted: 48, interviewed: 32, offered: 22, accepted: 18, enrolled: 15, conversionRate: '17.2%' },
      { course: 'Business Analytics', totalApplications: 76, shortlisted: 42, interviewed: 28, offered: 18, accepted: 15, enrolled: 12, conversionRate: '15.8%' },
      { course: 'AI & Machine Learning', totalApplications: 110, shortlisted: 62, interviewed: 40, offered: 28, accepted: 22, enrolled: 18, conversionRate: '16.4%' },
      { course: 'Healthcare Management', totalApplications: 54, shortlisted: 30, interviewed: 20, offered: 14, accepted: 11, enrolled: 9, conversionRate: '16.7%' },
      { course: 'Creative Arts & Design', totalApplications: 42, shortlisted: 25, interviewed: 18, offered: 12, accepted: 10, enrolled: 8, conversionRate: '19.0%' },
    ],
  },
  '3': {
    title: 'Selection Pipeline Report',
    description: 'Detailed breakdown of applications across all selection stages with timelines',
    columns: [
      { key: 'stage', label: 'Stage' },
      { key: 'count', label: 'Candidates' },
      { key: 'avgDays', label: 'Avg Days in Stage' },
      { key: 'movedForward', label: 'Moved Forward' },
      { key: 'rejected', label: 'Rejected' },
      { key: 'pending', label: 'Pending' },
      { key: 'dropoffRate', label: 'Drop-off Rate' },
      { key: 'bottleneck', label: 'Status' },
    ],
    data: [
      { stage: 'Submitted', count: 414, avgDays: 2, movedForward: 352, rejected: 42, pending: 20, dropoffRate: '10.1%', bottleneck: 'Normal' },
      { stage: 'Under Review', count: 352, avgDays: 5, movedForward: 285, rejected: 48, pending: 19, dropoffRate: '13.6%', bottleneck: 'Normal' },
      { stage: 'Shortlisted', count: 285, avgDays: 7, movedForward: 198, rejected: 62, pending: 25, dropoffRate: '21.8%', bottleneck: 'Attention' },
      { stage: 'Interview', count: 198, avgDays: 10, movedForward: 145, rejected: 38, pending: 15, dropoffRate: '19.2%', bottleneck: 'Slow' },
      { stage: 'Offer Sent', count: 145, avgDays: 4, movedForward: 112, rejected: 8, pending: 25, dropoffRate: '5.5%', bottleneck: 'Normal' },
      { stage: 'Accepted', count: 112, avgDays: 3, movedForward: 95, rejected: 5, pending: 12, dropoffRate: '4.5%', bottleneck: 'Normal' },
      { stage: 'Enrolled', count: 95, avgDays: 1, movedForward: 95, rejected: 0, pending: 0, dropoffRate: '0%', bottleneck: 'Complete' },
    ],
  },
  '4': {
    title: 'Talent Pool Analysis',
    description: 'Candidate demographics, qualifications, match scores, and regional distribution',
    columns: [
      { key: 'region', label: 'Region' },
      { key: 'candidates', label: 'Candidates' },
      { key: 'verified', label: 'Verified' },
      { key: 'avgMatchScore', label: 'Avg Match Score' },
      { key: 'topProgram', label: 'Top Program' },
      { key: 'scholarshipEligible', label: 'Scholarship Eligible' },
      { key: 'avgGPA', label: 'Avg GPA/Percentage' },
      { key: 'conversionRate', label: 'Conversion Rate' },
    ],
    data: [
      { region: 'South Asia', candidates: 380, verified: 312, avgMatchScore: '78%', topProgram: 'Computer Science', scholarshipEligible: 85, avgGPA: '82%', conversionRate: '22%' },
      { region: 'Middle East', candidates: 245, verified: 198, avgMatchScore: '81%', topProgram: 'MBA', scholarshipEligible: 62, avgGPA: '79%', conversionRate: '25%' },
      { region: 'East Asia', candidates: 210, verified: 185, avgMatchScore: '85%', topProgram: 'Engineering', scholarshipEligible: 72, avgGPA: '88%', conversionRate: '28%' },
      { region: 'Africa', candidates: 180, verified: 142, avgMatchScore: '74%', topProgram: 'Healthcare', scholarshipEligible: 95, avgGPA: '76%', conversionRate: '18%' },
      { region: 'Europe', candidates: 120, verified: 108, avgMatchScore: '83%', topProgram: 'Business Analytics', scholarshipEligible: 35, avgGPA: '84%', conversionRate: '30%' },
      { region: 'Latin America', candidates: 78, verified: 62, avgMatchScore: '76%', topProgram: 'Creative Arts', scholarshipEligible: 28, avgGPA: '80%', conversionRate: '20%' },
      { region: 'North America', candidates: 32, verified: 30, avgMatchScore: '88%', topProgram: 'Data Science', scholarshipEligible: 8, avgGPA: '90%', conversionRate: '35%' },
    ],
  },
  '5': {
    title: 'Acceptance & Enrollment Report',
    description: 'Offer letters sent, acceptance rates, and final enrollment statistics',
    columns: [
      { key: 'course', label: 'Course' },
      { key: 'offersSent', label: 'Offers Sent' },
      { key: 'accepted', label: 'Accepted' },
      { key: 'declined', label: 'Declined' },
      { key: 'pending', label: 'Pending' },
      { key: 'enrolled', label: 'Enrolled' },
      { key: 'acceptanceRate', label: 'Acceptance Rate' },
      { key: 'enrollmentRate', label: 'Enrollment Rate' },
    ],
    data: [
      { course: 'Computer Science MSc', offersSent: 38, accepted: 30, declined: 5, pending: 3, enrolled: 25, acceptanceRate: '78.9%', enrollmentRate: '83.3%' },
      { course: 'MBA Program', offersSent: 32, accepted: 28, declined: 2, pending: 2, enrolled: 22, acceptanceRate: '87.5%', enrollmentRate: '78.6%' },
      { course: 'Data Science MSc', offersSent: 25, accepted: 20, declined: 3, pending: 2, enrolled: 16, acceptanceRate: '80.0%', enrollmentRate: '80.0%' },
      { course: 'Engineering BSc', offersSent: 22, accepted: 18, declined: 3, pending: 1, enrolled: 15, acceptanceRate: '81.8%', enrollmentRate: '83.3%' },
      { course: 'Business Analytics', offersSent: 18, accepted: 15, declined: 2, pending: 1, enrolled: 12, acceptanceRate: '83.3%', enrollmentRate: '80.0%' },
      { course: 'AI & Machine Learning', offersSent: 28, accepted: 22, declined: 4, pending: 2, enrolled: 18, acceptanceRate: '78.6%', enrollmentRate: '81.8%' },
    ],
  },
  '6': {
    title: 'Match Score Analysis',
    description: 'Distribution of match scores across criteria with top-scoring candidate profiles',
    columns: [
      { key: 'candidate', label: 'Candidate' },
      { key: 'course', label: 'Applied Course' },
      { key: 'overallScore', label: 'Overall Score' },
      { key: 'academicScore', label: 'Academic' },
      { key: 'testScore', label: 'Test Scores' },
      { key: 'experienceScore', label: 'Experience' },
      { key: 'sopScore', label: 'SOP Quality' },
      { key: 'recommendation', label: 'Recommendation' },
    ],
    data: [
      { candidate: 'Fatima Al-Sayed', course: 'MBA Program', overallScore: 95, academicScore: 92, testScore: 98, experienceScore: 95, sopScore: 90, recommendation: 'Strong Accept' },
      { candidate: 'Ahmed Al-Rashid', course: 'Computer Science MSc', overallScore: 92, academicScore: 90, testScore: 94, experienceScore: 88, sopScore: 92, recommendation: 'Accept' },
      { candidate: 'Maria Garcia', course: 'Business Analytics', overallScore: 91, academicScore: 88, testScore: 90, experienceScore: 92, sopScore: 88, recommendation: 'Accept' },
      { candidate: 'Yuki Tanaka', course: 'Computer Science MSc', overallScore: 89, academicScore: 92, testScore: 86, experienceScore: 85, sopScore: 90, recommendation: 'Accept' },
      { candidate: 'Sarah Chen', course: 'MBA Program', overallScore: 87, academicScore: 85, testScore: 88, experienceScore: 90, sopScore: 82, recommendation: 'Accept' },
      { candidate: 'Priya Sharma', course: 'Data Science MSc', overallScore: 84, academicScore: 86, testScore: 82, experienceScore: 80, sopScore: 85, recommendation: 'Conditional' },
      { candidate: 'Carlos Rodriguez', course: 'Data Science MSc', overallScore: 82, academicScore: 80, testScore: 84, experienceScore: 78, sopScore: 82, recommendation: 'Conditional' },
      { candidate: 'James Okonkwo', course: 'Engineering BSc', overallScore: 76, academicScore: 78, testScore: 72, experienceScore: 74, sopScore: 78, recommendation: 'Waitlist' },
      { candidate: 'Li Wei', course: 'Computer Science MSc', overallScore: 68, academicScore: 72, testScore: 65, experienceScore: 60, sopScore: 70, recommendation: 'Review' },
      { candidate: 'Anna Kowalski', course: 'Engineering BSc', overallScore: 71, academicScore: 74, testScore: 70, experienceScore: 65, sopScore: 72, recommendation: 'Waitlist' },
    ],
  },
  '7': {
    title: 'Engagement & Content Report',
    description: 'Community posts, wall activity, reels views, and event registrations',
    columns: [
      { key: 'contentType', label: 'Content Type' },
      { key: 'totalPosts', label: 'Total Posts' },
      { key: 'views', label: 'Views' },
      { key: 'likes', label: 'Likes' },
      { key: 'comments', label: 'Comments' },
      { key: 'shares', label: 'Shares' },
      { key: 'engagementRate', label: 'Engagement Rate' },
      { key: 'topPerformer', label: 'Top Content' },
    ],
    data: [
      { contentType: 'Community Posts', totalPosts: 156, views: 12400, likes: 2340, comments: 890, shares: 345, engagementRate: '28.8%', topPerformer: 'Campus Tour Virtual Event' },
      { contentType: 'Wall Posts', totalPosts: 89, views: 8700, likes: 1560, comments: 420, shares: 210, engagementRate: '25.2%', topPerformer: 'Scholarship Announcement' },
      { contentType: 'Reels', totalPosts: 34, views: 45000, likes: 8900, comments: 2100, shares: 1500, engagementRate: '27.8%', topPerformer: 'Student Life Day' },
      { contentType: 'Events', totalPosts: 22, views: 6800, likes: 890, comments: 340, shares: 520, engagementRate: '25.7%', topPerformer: 'Open Day 2026' },
      { contentType: 'Newsletters', totalPosts: 12, views: 3400, likes: 0, comments: 0, shares: 180, engagementRate: '5.3%', topPerformer: 'March Newsletter' },
    ],
  },
  '8': {
    title: 'Event & Scholarship Report',
    description: 'Event attendance, scholarship applications, and award distribution',
    columns: [
      { key: 'name', label: 'Event/Scholarship' },
      { key: 'type', label: 'Type' },
      { key: 'registrations', label: 'Registrations' },
      { key: 'attendance', label: 'Attendance' },
      { key: 'applications', label: 'Applications' },
      { key: 'awarded', label: 'Awarded' },
      { key: 'totalAmount', label: 'Total Amount' },
      { key: 'status', label: 'Status' },
    ],
    data: [
      { name: 'Open Day Spring 2026', type: 'Event', registrations: 450, attendance: 380, applications: '-', awarded: '-', totalAmount: '-', status: 'Completed' },
      { name: 'Virtual Campus Tour', type: 'Event', registrations: 320, attendance: 280, applications: '-', awarded: '-', totalAmount: '-', status: 'Completed' },
      { name: 'Merit Scholarship 2026', type: 'Scholarship', registrations: '-', attendance: '-', applications: 245, awarded: 35, totalAmount: '$175,000', status: 'Active' },
      { name: 'Research Excellence Award', type: 'Scholarship', registrations: '-', attendance: '-', applications: 120, awarded: 15, totalAmount: '$90,000', status: 'Active' },
      { name: 'International Student Webinar', type: 'Event', registrations: 560, attendance: 420, applications: '-', awarded: '-', totalAmount: '-', status: 'Completed' },
      { name: 'Need-Based Financial Aid', type: 'Scholarship', registrations: '-', attendance: '-', applications: 310, awarded: 48, totalAmount: '$240,000', status: 'Review' },
      { name: 'Alumni Networking Night', type: 'Event', registrations: 180, attendance: 145, applications: '-', awarded: '-', totalAmount: '-', status: 'Upcoming' },
    ],
  },
};

const stageColors: Record<string, string> = {
  'Submitted': 'bg-muted text-muted-foreground',
  'Under Review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Shortlisted': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Offer Sent': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'Accepted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Enrolled': 'bg-primary/10 text-primary',
  'Normal': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Attention': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Slow': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Complete': 'bg-primary/10 text-primary',
  'Strong Accept': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Accept': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'Conditional': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'Waitlist': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Review': 'bg-muted text-muted-foreground',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Upcoming': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Event': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'Scholarship': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const scoreColorCells = ['matchScore', 'overallScore', 'academicScore', 'testScore', 'experienceScore', 'sopScore'];
const badgeCells = ['stage', 'bottleneck', 'recommendation', 'status', 'type'];

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university/reports' : '/reports';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const report = reportDataMap[reportId || ''];

  const filteredData = useMemo(() => {
    if (!report) return [];
    let data = [...report.data];
    if (searchQuery) {
      data = data.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (sortKey) {
      data.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const numA = typeof aVal === 'number' ? aVal : parseFloat(String(aVal).replace(/[^0-9.-]/g, ''));
        const numB = typeof bVal === 'number' ? bVal : parseFloat(String(bVal).replace(/[^0-9.-]/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDir === 'asc' ? numA - numB : numB - numA;
        }
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return data;
  }, [report, searchQuery, sortKey, sortDir]);

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(basePath)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Report not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleDownloadCSV = () => {
    const headers = report.columns.map(c => c.label).join(',');
    const rows = report.data.map(row => report.columns.map(c => `"${row[c.key]}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: `${report.title} exported as CSV.` });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: 'Print', description: 'Print dialog opened.' });
  };

  const renderCellValue = (key: string, value: any) => {
    if (badgeCells.includes(key) && stageColors[value]) {
      return <Badge className={stageColors[value]} variant="secondary">{value}</Badge>;
    }
    if (scoreColorCells.includes(key) && typeof value === 'number') {
      const color = value >= 85 ? 'text-green-600 font-semibold' : value >= 70 ? 'text-amber-600 font-medium' : 'text-muted-foreground';
      return <span className={color}>{value}%</span>;
    }
    return value;
  };

  // Summary stats
  const totalRows = report.data.length;
  const numericCols = report.columns.filter(c => typeof report.data[0]?.[c.key] === 'number');

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{report.title}</h1>
            <p className="text-muted-foreground text-sm">{report.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button size="sm" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalRows}</p>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
        {numericCols.slice(0, 3).map(col => {
          const sum = report.data.reduce((acc, row) => acc + (Number(row[col.key]) || 0), 0);
          const avg = Math.round(sum / totalRows);
          return (
            <Card key={col.key}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{avg}</p>
                <p className="text-xs text-muted-foreground">Avg {col.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 print:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in report data..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="self-center px-3 py-1.5">
          {filteredData.length} of {totalRows} records
        </Badge>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {report.columns.map(col => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer hover:bg-muted/50 select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          sortDir === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {report.columns.map(col => (
                      <TableCell key={col.key}>
                        {renderCellValue(col.key, row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={report.columns.length} className="text-center py-8 text-muted-foreground">
                      No matching records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Print header */}
      <div className="hidden print:block text-center text-xs text-muted-foreground mt-4">
        Generated on {new Date().toLocaleDateString()} • {report.title}
      </div>
    </div>
  );
};

export default ReportDetail;
