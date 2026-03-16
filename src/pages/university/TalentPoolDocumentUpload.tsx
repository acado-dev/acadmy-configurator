import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, File, CheckCircle2, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ParsedDocument {
  id: string;
  fileName: string;
  type: 'CV' | 'Transcript' | 'Certificate' | 'Other';
  status: 'parsing' | 'parsed' | 'error';
  extractedData?: {
    name?: string;
    email?: string;
    phone?: string;
    education?: string;
    skills?: string[];
    experience?: string;
    matchScore?: number;
  };
}

const TalentPoolDocumentUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university/talent-pool' : '/talent-pool';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<ParsedDocument[]>([]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: ParsedDocument[] = Array.from(files).map((file, i) => ({
      id: `doc-${Date.now()}-${i}`,
      fileName: file.name,
      type: file.name.toLowerCase().includes('cv') || file.name.toLowerCase().includes('resume') ? 'CV' : 
            file.name.toLowerCase().includes('transcript') ? 'Transcript' :
            file.name.toLowerCase().includes('cert') ? 'Certificate' : 'Other',
      status: 'parsing' as const,
    }));

    setDocuments(prev => [...prev, ...newDocs]);

    // Simulate AI parsing for each
    newDocs.forEach((doc, i) => {
      setTimeout(() => {
        setDocuments(prev => prev.map(d => d.id === doc.id ? {
          ...d,
          status: 'parsed' as const,
          extractedData: {
            name: ['Sarah Johnson', 'Amit Kumar', 'Maria Garcia', 'Li Wei', 'Ahmed Hassan'][i % 5],
            email: [`candidate${i + 1}@email.com`],
            phone: `+1 555-${String(1000 + i).padStart(4, '0')}`,
            education: ['B.Sc Computer Science - MIT', 'B.Tech ECE - IIT Delhi', 'BA Design - University of Madrid', 'B.Sc Physics - Peking University', 'High School - Cairo Academy'][i % 5],
            skills: [['Python', 'Machine Learning', 'Data Analysis'], ['Java', 'Cloud Computing', 'DevOps'], ['UI/UX Design', 'Figma', 'Adobe'], ['Mathematics', 'Research', 'LaTeX'], ['Engineering', 'CAD', 'Project Management']][i % 5],
            experience: ['2 years at Google', '1 year at TCS', '3 years freelance', 'Research assistant', 'Intern at Siemens'][i % 5],
            matchScore: [92, 85, 78, 88, 74][i % 5],
          },
        } : d));
      }, 1500 + i * 800);
    });

    toast({ title: 'Processing Documents', description: `${files.length} document(s) being parsed by AI...` });
  };

  const handleAddToPool = (doc: ParsedDocument) => {
    if (!doc.extractedData) return;
    const existing = JSON.parse(localStorage.getItem('talentPoolCandidates') || '[]');
    const newCandidate = {
      id: `parsed-${Date.now()}`,
      name: doc.extractedData.name,
      email: doc.extractedData.email,
      phone: doc.extractedData.phone,
      applicationStage: 'Lead',
      eligibilityStatus: 'Eligible',
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existing.push(newCandidate);
    localStorage.setItem('talentPoolCandidates', JSON.stringify(existing));
    toast({ title: 'Added to Pool', description: `${doc.extractedData.name} has been added to the talent pool.` });
    setDocuments(prev => prev.filter(d => d.id !== doc.id));
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'parsing': return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'parsed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Upload & AI Parsing</h1>
          <p className="text-muted-foreground">Upload CVs, transcripts, and certificates for automatic data extraction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upload Documents</CardTitle>
            <CardDescription>Supported: PDF, DOCX, JPG, PNG • AI will extract candidate data automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-foreground">Drop documents here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">Upload multiple files at once for batch processing</p>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.jpg,.png" multiple className="hidden" onChange={handleFilesSelect} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Parsing Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">CV / Resume</p>
                <p className="text-muted-foreground">Extracts name, contact, education, skills, experience</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <File className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Transcript</p>
                <p className="text-muted-foreground">Extracts grades, courses, institution details</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <File className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p className="font-medium">Certificate</p>
                <p className="text-muted-foreground">Extracts test scores, certifications, dates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Processed Documents ({documents.length})</h2>
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {statusIcon(doc.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{doc.fileName}</p>
                        <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                        <Badge variant={doc.status === 'parsed' ? 'default' : doc.status === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                          {doc.status === 'parsing' ? 'Processing...' : doc.status === 'parsed' ? 'Parsed' : 'Error'}
                        </Badge>
                      </div>

                      {doc.status === 'parsed' && doc.extractedData && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Name</p>
                            <p className="font-medium">{doc.extractedData.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Education</p>
                            <p className="font-medium">{doc.extractedData.education}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Experience</p>
                            <p className="font-medium">{doc.extractedData.experience}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Match Score</p>
                            <p className="font-medium text-primary">{doc.extractedData.matchScore}%</p>
                          </div>
                          {doc.extractedData.skills && (
                            <div className="col-span-full">
                              <p className="text-muted-foreground text-xs mb-1">Skills</p>
                              <div className="flex flex-wrap gap-1">
                                {doc.extractedData.skills.map(s => (
                                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {doc.status === 'parsing' && (
                        <Progress value={60} className="mt-2 max-w-xs" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {doc.status === 'parsed' && (
                      <Button size="sm" onClick={() => handleAddToPool(doc)}>Add to Pool</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => removeDocument(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TalentPoolDocumentUpload;
