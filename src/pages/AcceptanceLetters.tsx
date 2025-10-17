import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Award, Mail, Eye } from 'lucide-react';
import { useApplicationSubmissions } from '@/hooks/useApplicationSubmissions';

const AcceptanceLetters = () => {
  const { applications } = useApplicationSubmissions();

  useEffect(() => {
    document.title = 'Acceptance Letters | ACADO Admin';
  }, []);

  const acceptedApplications = useMemo(() => (
    applications.filter(a => a.status === 'accepted')
  ), [applications]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Acceptance Letters</h1>
          <p className="text-muted-foreground">Manage generated letters and resend to accepted applicants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Accepted Applicants</CardTitle>
          <CardDescription>
            {acceptedApplications.length} acceptance {acceptedApplications.length === 1 ? 'letter' : 'letters'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {acceptedApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No accepted applications yet.</p>
          ) : (
            <div className="space-y-3">
              {acceptedApplications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{app.applicantName}</h4>
                      <Badge variant="default" className="gap-1">
                        <Award className="h-3 w-3" /> Accepted
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {app.applicantEmail} • {app.courseName} • Submitted {new Date(app.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" /> View Letter
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Mail className="h-4 w-4 mr-2" /> Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptanceLetters;
