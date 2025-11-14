import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const reportTemplates = [
  {
    id: 'course-completion',
    name: 'Course Completion Report',
    description: 'Overall and per-user course completion data',
    category: 'course',
    fields: ['user_id', 'name', 'email', 'course_id', 'course_name', 'module_completions', 'completion_date', 'score', 'certificate_id'],
  },
  {
    id: 'module-completion',
    name: 'Module Completion Report',
    description: 'Module-wise completion statistics',
    category: 'course',
    fields: ['module_id', 'module_name', 'users_started', 'users_completed', 'avg_time_spent'],
  },
  {
    id: 'content-engagement',
    name: 'Content Engagement Report',
    description: 'Per content item views and engagement metrics',
    category: 'content',
    fields: ['content_id', 'title', 'type', 'views', 'unique_users', 'avg_time', 'completions', 'likes'],
  },
  {
    id: 'access-log',
    name: 'Access Log Summary',
    description: 'User login events and session data',
    category: 'user',
    fields: ['user_id', 'name', 'email', 'login_events', 'last_seen', 'total_sessions', 'avg_session_duration', 'ip', 'country'],
  },
  {
    id: 'daily-usage',
    name: 'Daily Usage Report',
    description: 'Daily active users and top content',
    category: 'user',
    fields: ['date', 'active_users', 'sessions', 'top_content'],
  },
  {
    id: 'events-summary',
    name: 'Events Summary',
    description: 'Event statistics and performance',
    category: 'event',
    fields: ['event_id', 'title', 'type', 'start_date', 'end_date', 'registrations', 'attendance', 'conversion_rate', 'avg_score'],
  },
  {
    id: 'scholarships-summary',
    name: 'Scholarships Summary',
    description: 'Scholarship applications and awards',
    category: 'scholarship',
    fields: ['scholarship_id', 'title', 'provider', 'type', 'amount', 'deadline', 'applicants_count', 'shortlisted_count', 'awarded_count'],
  },
  {
    id: 'reels-engagement',
    name: 'Reels & Community Report',
    description: 'Reels and community post engagement',
    category: 'engagement',
    fields: ['item_id', 'type', 'title', 'uploads', 'views', 'likes', 'shares', 'created_by', 'created_at'],
  },
  {
    id: 'interested-users',
    name: 'Interested Users Export',
    description: 'User interest data with masked PII',
    category: 'user',
    fields: ['user_id', 'name', 'email', 'mobile', 'organization', 'education_qualification', 'interest_category', 'created_at'],
  },
];

const mockReportData = [
  { user_id: 'U001', name: 'John Doe', email: 'john@example.com', course_id: 'C001', course_name: 'AI Fundamentals', module_completions: '8/10', completion_date: '2024-01-15', score: 85, certificate_id: 'CERT001' },
  { user_id: 'U002', name: 'Jane Smith', email: 'jane@example.com', course_id: 'C001', course_name: 'AI Fundamentals', module_completions: '10/10', completion_date: '2024-01-18', score: 92, certificate_id: 'CERT002' },
  { user_id: 'U003', name: 'Bob Johnson', email: 'bob@example.com', course_id: 'C002', course_name: 'Leadership Skills', module_completions: '6/8', completion_date: '2024-01-20', score: 78, certificate_id: 'CERT003' },
];

export default function ReportsTab() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [filters, setFilters] = useState({
    organization: 'all',
    status: 'all',
    language: 'all',
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const report = reportTemplates.find(r => r.id === selectedReport);
    if (!report) return;

    toast({
      title: 'Export Started',
      description: `Exporting ${report.name} as ${format.toUpperCase()}...`,
    });

    // Mock export - in production, this would trigger actual export
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${report.name} has been exported successfully.`,
      });
    }, 2000);
  };

  const selectedReportData = reportTemplates.find(r => r.id === selectedReport);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Report Templates */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Select a report to configure and export</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1 p-4">
              {reportTemplates.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    selectedReport === report.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{report.name}</p>
                      <p className={cn(
                        'text-xs mt-1 line-clamp-2',
                        selectedReport === report.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      )}>
                        {report.description}
                      </p>
                      <span className={cn(
                        'inline-block text-xs mt-2 px-2 py-0.5 rounded',
                        selectedReport === report.id
                          ? 'bg-primary-foreground/20'
                          : 'bg-secondary'
                      )}>
                        {report.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Panel - Configuration & Preview */}
      <Card className="lg:col-span-2">
        {selectedReportData ? (
          <>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedReportData.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedReportData.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Configure Filters</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(dateRange.start, 'MMM dd, yyyy')} - {format(dateRange.end, 'MMM dd, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.start}
                          onSelect={(date) => date && setDateRange({ ...dateRange, start: date })}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Select value={filters.organization} onValueChange={(value) => setFilters({ ...filters, organization: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Organizations</SelectItem>
                        <SelectItem value="org1">Organization 1</SelectItem>
                        <SelectItem value="org2">Organization 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedReportData.category !== 'user' && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={filters.language} onValueChange={(value) => setFilters({ ...filters, language: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Fields Selection */}
              <div className="space-y-3">
                <Label>Report Fields</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedReportData.fields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox id={field} defaultChecked />
                      <label
                        htmlFor={field}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {field.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Data Preview (First 3 rows)</Label>
                    <span className="text-xs text-muted-foreground">Showing 3 of 2,847 records</span>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            {selectedReportData.fields.slice(0, 6).map((field) => (
                              <th key={field} className="text-left p-3 font-medium">
                                {field.replace(/_/g, ' ')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mockReportData.map((row, idx) => (
                            <tr key={idx} className="border-t">
                              {Object.values(row).slice(0, 6).map((value, vidx) => (
                                <td key={vidx} className="p-3">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button onClick={() => handleExport('csv')} className="flex-1 sm:flex-none">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => handleExport('xlsx')} variant="outline" className="flex-1 sm:flex-none">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export XLSX
                </Button>
                <Button onClick={() => handleExport('pdf')} variant="outline" className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              {/* Schedule Export */}
              <div className="pt-4 border-t">
                <Label className="mb-3 block">Schedule Automated Export</Label>
                <div className="flex gap-3">
                  <Select defaultValue="none">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Schedule</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="admin@example.com" className="flex-1" />
                  <Button variant="outline">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[600px]">
            <div className="text-center space-y-3">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-lg font-medium">Select a Report Template</p>
              <p className="text-sm text-muted-foreground">
                Choose a report from the list to configure filters and export data
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
