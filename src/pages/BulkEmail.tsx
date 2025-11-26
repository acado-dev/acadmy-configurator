import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Send, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplate, BulkEmailJob, CSVRow, EmailSendResult } from '@/types/emailTemplate';

const BulkEmail = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [jobs, setJobs] = useState<BulkEmailJob[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
    loadJobs();
  }, []);

  const loadTemplates = () => {
    const stored = localStorage.getItem('emailTemplates');
    if (stored) {
      const allTemplates: EmailTemplate[] = JSON.parse(stored);
      setTemplates(allTemplates.filter((t) => t.status === 'Active'));
    }
  };

  const loadJobs = () => {
    const stored = localStorage.getItem('bulkEmailJobs');
    if (stored) {
      setJobs(JSON.parse(stored));
    }
  };

  const saveJobs = (updatedJobs: BulkEmailJob[]) => {
    localStorage.setItem('bulkEmailJobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
  };

  const downloadSampleCSV = () => {
    const csv = 'email,name,mobile_number\njohn.doe@example.com,John Doe,+1234567890\njane.smith@example.com,Jane Smith,+1987654321';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_email.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file format',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter((row) => row.trim());
      const headers = rows[0].split(',').map((h) => h.trim());
      
      if (!headers.includes('email') || !headers.includes('name')) {
        toast({
          title: 'Invalid CSV format',
          description: 'CSV must contain email and name columns',
          variant: 'destructive',
        });
        return;
      }

      const data: CSVRow[] = [];
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',').map((v) => v.trim());
        if (values.length >= 2) {
          data.push({
            email: values[headers.indexOf('email')],
            name: values[headers.indexOf('name')],
            mobile_number: values[headers.indexOf('mobile_number')] || '',
          });
        }
      }
      
      setCsvData(data);
      toast({ title: `Loaded ${data.length} records from CSV` });
    };
    
    reader.readAsText(file);
  };

  const replaceVariables = (text: string, row: CSVRow): string => {
    return text
      .replace(/\{\{name\}\}/g, row.name)
      .replace(/\{\{email\}\}/g, row.email)
      .replace(/\{\{mobile_number\}\}/g, row.mobile_number);
  };

  const handleSubmit = () => {
    if (!selectedTemplate || !purpose || csvData.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please select a template, enter purpose, and upload CSV',
        variant: 'destructive',
      });
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    // Simulate email sending
    const results: EmailSendResult[] = csvData.map((row) => {
      const success = Math.random() > 0.1; // 90% success rate
      return {
        ...row,
        status: success ? 'Success' : 'Failed',
        errorMessage: success ? undefined : 'Invalid email address',
      };
    });

    const successCount = results.filter((r) => r.status === 'Success').length;
    const failureCount = results.filter((r) => r.status === 'Failed').length;

    const newJob: BulkEmailJob = {
      id: Date.now().toString(),
      purpose,
      templateId: template.id,
      templateName: template.templateName,
      uploadedBy: 'admin@acado.ai',
      uploadedAt: new Date().toISOString(),
      status: 'Processing',
      totalRecords: csvData.length,
      successCount: 0,
      failureCount: 0,
      csvFileName: uploadedFile?.name || 'unknown.csv',
      csvData,
      results,
    };

    saveJobs([newJob, ...jobs]);

    // Simulate processing
    setTimeout(() => {
      const updatedJobs = jobs.map((j) =>
        j.id === newJob.id
          ? { ...j, status: 'Completed' as const, successCount, failureCount }
          : j
      );
      saveJobs([{ ...newJob, status: 'Completed', successCount, failureCount }, ...jobs]);
    }, 2000);

    toast({ title: 'Bulk email job queued successfully' });
    
    // Reset form
    setSelectedTemplate('');
    setPurpose('');
    setUploadedFile(null);
    setCsvData([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadResults = (job: BulkEmailJob) => {
    if (!job.results) return;

    const headers = 'email,name,mobile_number,status,error_message\n';
    const rows = job.results
      .map(
        (r) =>
          `${r.email},${r.name},${r.mobile_number},${r.status},${r.errorMessage || ''}`
      )
      .join('\n');
    const csv = headers + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${job.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Email</h1>
        <p className="text-muted-foreground mt-1">
          Send campaigns using email templates with CSV upload
        </p>
      </div>

      {/* Upload Form */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload & Send Campaign</h2>
          <Button variant="outline" onClick={downloadSampleCSV}>
            <Download className="mr-2 h-4 w-4" />
            Download Sample CSV
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload CSV */}
          <div className="space-y-2">
            <Label htmlFor="csv-upload">
              Upload CSV File <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="csv-upload"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              {csvData.length > 0 && (
                <Badge variant="secondary">{csvData.length} records</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              CSV must contain: email, name, mobile_number
            </p>
          </div>

          {/* Select Template */}
          <div className="space-y-2">
            <Label htmlFor="template">
              Select Template <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose email template" />
              </SelectTrigger>
              <SelectContent>
                {templates.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No active templates found
                  </SelectItem>
                ) : (
                  templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.templateName} - {template.purpose}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <Label htmlFor="purpose">
            Purpose of this Mail <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., New Course Launch Campaign, Event Registration Reminder..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!selectedTemplate || !purpose || csvData.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit & Queue Emails
          </Button>
        </div>
      </Card>

      {/* Jobs Log */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Campaign History</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Purpose</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No campaigns sent yet. Upload a CSV to get started.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.purpose}</TableCell>
                    <TableCell>{job.templateName}</TableCell>
                    <TableCell>{job.uploadedBy}</TableCell>
                    <TableCell>
                      {new Date(job.uploadedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === 'Completed'
                            ? 'default'
                            : job.status === 'Failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.totalRecords}</TableCell>
                    <TableCell className="text-green-600">{job.successCount}</TableCell>
                    <TableCell className="text-destructive">{job.failureCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadResults(job)}
                        disabled={!job.results}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default BulkEmail;
