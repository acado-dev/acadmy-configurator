import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, FileSpreadsheet, FileText, File, CheckCircle2, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExportHistory {
  id: string;
  name: string;
  format: string;
  records: number;
  date: string;
  status: 'ready' | 'generating';
}

const TalentPoolExport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university/talent-pool' : '/talent-pool';

  const [format, setFormat] = useState('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'email', 'phone', 'nationality', 'programLevel', 'intendedProgram',
    'applicationStage', 'matchScore', 'eligibilityStatus',
  ]);
  const [filter, setFilter] = useState('all');

  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    { id: '1', name: 'Full Talent Pool Export', format: 'CSV', records: 1245, date: '2026-03-15', status: 'ready' },
    { id: '2', name: 'Shortlisted Candidates', format: 'XLSX', records: 89, date: '2026-03-14', status: 'ready' },
    { id: '3', name: 'Scholarship Eligible Report', format: 'PDF', records: 56, date: '2026-03-12', status: 'ready' },
  ]);

  const availableFields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'currentLocation', label: 'Location' },
    { key: 'programLevel', label: 'Program Level' },
    { key: 'intendedProgram', label: 'Intended Program' },
    { key: 'preferredCountries', label: 'Preferred Countries' },
    { key: 'lastDegree', label: 'Last Degree' },
    { key: 'institution', label: 'Institution' },
    { key: 'percentage', label: 'Percentage/CGPA' },
    { key: 'examType', label: 'Exam Type' },
    { key: 'examScore', label: 'Exam Score' },
    { key: 'applicationStage', label: 'Application Stage' },
    { key: 'matchScore', label: 'Match Score' },
    { key: 'eligibilityStatus', label: 'Eligibility Status' },
    { key: 'isVerified', label: 'Verified Status' },
    { key: 'isShortlisted', label: 'Shortlisted Status' },
    { key: 'scholarshipEligible', label: 'Scholarship Eligible' },
    { key: 'createdAt', label: 'Registration Date' },
  ];

  const toggleField = (key: string) => {
    setSelectedFields(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({ title: 'No Fields Selected', description: 'Please select at least one field to export.', variant: 'destructive' });
      return;
    }

    const newExport: ExportHistory = {
      id: `exp-${Date.now()}`,
      name: `${filter === 'all' ? 'Full' : filter} Talent Pool Export`,
      format: format.toUpperCase(),
      records: filter === 'all' ? 1245 : filter === 'shortlisted' ? 89 : filter === 'verified' ? 876 : 56,
      date: new Date().toISOString().split('T')[0],
      status: 'generating',
    };

    setExportHistory(prev => [newExport, ...prev]);

    setTimeout(() => {
      setExportHistory(prev => prev.map(e => e.id === newExport.id ? { ...e, status: 'ready' as const } : e));
      toast({ title: 'Export Ready', description: `Your ${format.toUpperCase()} export is ready for download.` });
    }, 2000);
  };

  const handleDownload = (exp: ExportHistory) => {
    const csvContent = selectedFields.join(',') + '\nSample Data Row 1\nSample Data Row 2';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exp.name.replace(/\s+/g, '_')}.${exp.format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Downloaded', description: `${exp.name} has been downloaded.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Export Reports</h1>
          <p className="text-muted-foreground">Export talent pool data in various formats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configure Export</CardTitle>
              <CardDescription>Select format, fields, and filters for your export</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="pdf">PDF Report (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Filter Candidates</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="verified">Verified Only</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="scholarship">Scholarship Eligible</SelectItem>
                      <SelectItem value="accepted">Accepted / Offer Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Select Fields ({selectedFields.length} selected)</Label>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFields(availableFields.map(f => f.key))}>Select All</Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFields([])}>Clear All</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableFields.map(field => (
                    <div key={field.key} className="flex items-center gap-2">
                      <Checkbox
                        id={field.key}
                        checked={selectedFields.includes(field.key)}
                        onCheckedChange={() => toggleField(field.key)}
                      />
                      <label htmlFor={field.key} className="text-sm cursor-pointer">{field.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Generate Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export History</CardTitle>
            <CardDescription>Previously generated exports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exportHistory.map(exp => (
              <div key={exp.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-muted rounded">
                  {exp.format === 'CSV' ? <FileSpreadsheet className="h-4 w-4" /> :
                   exp.format === 'PDF' ? <FileText className="h-4 w-4" /> :
                   <File className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{exp.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{exp.format}</Badge>
                    <span className="text-xs text-muted-foreground">{exp.records} records</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{exp.date}</p>
                </div>
                {exp.status === 'ready' ? (
                  <Button size="sm" variant="ghost" onClick={() => handleDownload(exp)}>
                    <Download className="h-4 w-4" />
                  </Button>
                ) : (
                  <Clock className="h-4 w-4 text-yellow-600 animate-spin" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentPoolExport;
