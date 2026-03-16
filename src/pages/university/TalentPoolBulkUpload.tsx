import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const TalentPoolBulkUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university/talent-pool' : '/talent-pool';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<'idle' | 'preview' | 'uploading' | 'complete'>('idle');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ success: 0, errors: 0, duplicates: 0 });

  const sampleColumns = ['Name', 'Email', 'Phone', 'Nationality', 'Program Level', 'Intended Program', 'Preferred Country', 'Last Degree', 'Institution', 'Percentage', 'Exam Type', 'Exam Score'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast({ title: 'Invalid File', description: 'Please upload a CSV or XLSX file.', variant: 'destructive' });
      return;
    }

    // Simulate parsing
    const mockParsed = [
      { name: 'Amit Kumar', email: 'amit@email.com', phone: '+91 98765-43210', nationality: 'Indian', programLevel: 'PG', intendedProgram: 'Data Science', preferredCountry: 'USA', lastDegree: 'B.Tech', institution: 'IIT Delhi', percentage: '82%', examType: 'GRE', examScore: '320', status: 'valid' },
      { name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+91 87654-32109', nationality: 'Indian', programLevel: 'PG', intendedProgram: 'MBA', preferredCountry: 'UK', lastDegree: 'BBA', institution: 'Delhi University', percentage: '78%', examType: 'IELTS', examScore: '7.0', status: 'valid' },
      { name: 'Ahmed Hassan', email: 'ahmed.h@email.com', phone: '+20 1234-5678', nationality: 'Egyptian', programLevel: 'UG', intendedProgram: 'Engineering', preferredCountry: 'Germany', lastDegree: '12th Grade', institution: 'Cairo Academy', percentage: '90%', examType: 'TOEFL', examScore: '105', status: 'valid' },
      { name: 'Li Wei', email: '', phone: '+86 1234-5678', nationality: 'Chinese', programLevel: 'PG', intendedProgram: 'Computer Science', preferredCountry: 'Canada', lastDegree: 'B.Sc', institution: 'Peking University', percentage: '88%', examType: 'IELTS', examScore: '7.5', status: 'error' },
      { name: 'Maria Garcia', email: 'maria.g@email.com', phone: '+34 612-345-678', nationality: 'Spanish', programLevel: 'Diploma', intendedProgram: 'Design', preferredCountry: 'Netherlands', lastDegree: 'Bachelor', institution: 'University of Madrid', percentage: '75%', examType: 'Duolingo', examScore: '120', status: 'valid' },
    ];

    setPreviewData(mockParsed);
    setUploadState('preview');
    toast({ title: 'File Parsed', description: `${mockParsed.length} records found in ${file.name}` });
  };

  const handleUpload = () => {
    setUploadState('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('complete');
          const validCount = previewData.filter(r => r.status === 'valid').length;
          const errorCount = previewData.filter(r => r.status === 'error').length;
          setResults({ success: validCount, errors: errorCount, duplicates: 0 });

          // Save valid ones to localStorage
          const existing = JSON.parse(localStorage.getItem('talentPoolCandidates') || '[]');
          const newCandidates = previewData.filter(r => r.status === 'valid').map((r, i) => ({
            id: `bulk-${Date.now()}-${i}`,
            name: r.name,
            email: r.email,
            phone: r.phone,
            nationality: r.nationality,
            programLevel: r.programLevel,
            intendedProgram: r.intendedProgram,
            preferredCountries: [r.preferredCountry],
            applicationStage: 'Lead',
            eligibilityStatus: 'Eligible',
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          localStorage.setItem('talentPoolCandidates', JSON.stringify([...existing, ...newCandidates]));

          toast({ title: 'Upload Complete', description: `${validCount} candidates imported successfully.` });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const downloadTemplate = () => {
    const csvContent = sampleColumns.join(',') + '\nJohn Doe,john@email.com,+1234567890,American,PG,Computer Science,USA,B.Sc,MIT,85%,GRE,320';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'talent_pool_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Template Downloaded', description: 'CSV template has been downloaded.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Upload Candidates</h1>
          <p className="text-muted-foreground">Import multiple candidate profiles via CSV or Excel file</p>
        </div>
      </div>

      {uploadState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Upload File</CardTitle>
              <CardDescription>Select a CSV or XLSX file containing candidate data</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-2">Supports CSV and XLSX formats • Max 10,000 rows</p>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileSelect} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" /> Download CSV Template
              </Button>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Required Columns:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Name (required)</li>
                  <li>Email (required)</li>
                  <li>Phone</li>
                  <li>Program Level</li>
                  <li>Intended Program</li>
                </ul>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Tips:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Ensure no duplicate emails</li>
                  <li>Use standard country names</li>
                  <li>Date format: YYYY-MM-DD</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {uploadState === 'preview' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Preview Data</CardTitle>
              <CardDescription>{previewData.length} records found • {previewData.filter(r => r.status === 'valid').length} valid • {previewData.filter(r => r.status === 'error').length} errors</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setUploadState('idle'); setPreviewData([]); }}>Cancel</Button>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" /> Import {previewData.filter(r => r.status === 'valid').length} Candidates
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Degree</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, i) => (
                    <TableRow key={i} className={row.status === 'error' ? 'bg-destructive/5' : ''}>
                      <TableCell>
                        {row.status === 'valid' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.email || <span className="text-destructive text-xs">Missing email</span>}</TableCell>
                      <TableCell>{row.nationality}</TableCell>
                      <TableCell>{row.intendedProgram}</TableCell>
                      <TableCell>{row.preferredCountry}</TableCell>
                      <TableCell>{row.lastDegree}</TableCell>
                      <TableCell>{row.examType}: {row.examScore}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadState === 'uploading' && (
        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <FileSpreadsheet className="h-16 w-16 mx-auto text-primary animate-pulse" />
            <div>
              <h3 className="text-lg font-semibold">Importing Candidates...</h3>
              <p className="text-muted-foreground mt-1">Processing {previewData.length} records</p>
            </div>
            <Progress value={progress} className="max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      {uploadState === 'complete' && (
        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Import Complete!</h3>
              <p className="text-muted-foreground mt-1">Candidate data has been processed</p>
            </div>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{results.success}</p>
                <p className="text-sm text-muted-foreground">Imported</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{results.errors}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{results.duplicates}</p>
                <p className="text-sm text-muted-foreground">Duplicates</p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => { setUploadState('idle'); setPreviewData([]); }}>Upload More</Button>
              <Button onClick={() => navigate(`${basePath}/candidates`)}>View Candidates</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TalentPoolBulkUpload;
