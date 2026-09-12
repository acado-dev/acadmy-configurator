import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  Send,
  Mail,
  Clock,
  Upload,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  getDocumentRequestById,
  acceptRequestedDocument,
  reRequestDocument,
  attachRequestedDocument,
  updateDocumentRequestStatus,
  appendDocumentRequestEvent,
  DocumentRequest,
  DocumentRequestEvent,
  REASON_LABELS,
} from '@/lib/documentRequests';

const EVENT_ICONS: Record<DocumentRequestEvent['type'], React.ElementType> = {
  requested: Send,
  message: MessageSquare,
  uploaded: Upload,
  accepted: CheckCircle,
  cancelled: XCircle,
  note: Clock,
};

interface DocumentRequestViewerProps {
  requestId: string;
  onClose?: () => void;
  onUpdate?: () => void;
}

const DocumentRequestViewer = ({ requestId, onClose, onUpdate }: DocumentRequestViewerProps) => {
  const { toast } = useToast();
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [message, setMessage] = useState('');

  const refresh = () => {
    setRequest(getDocumentRequestById(requestId) || null);
    onUpdate?.();
  };

  useEffect(() => {
    setRequest(getDocumentRequestById(requestId) || null);
    setMessage('');
  }, [requestId]);

  if (!request) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Document request not found</CardTitle>
            <CardDescription>
              This request may have been removed. Close this pop-up and try again from the application.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const file = request.uploadedDocument;

  const handleAccept = () => {
    acceptRequestedDocument(request.id);
    refresh();
    toast({ title: 'Document accepted', description: 'Added to the application documents.' });
  };

  const handleReRequest = () => {
    reRequestDocument(
      request.id,
      message.trim() || `Please re-upload ${request.documentType}. The previous file was not acceptable.`,
    );
    setMessage('');
    refresh();
    toast({ title: 'Document requested again', description: `${request.applicantName} has been notified.` });
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({ title: 'Add a message first', variant: 'destructive' });
      return;
    }
    appendDocumentRequestEvent(request.id, 'message', 'admin', message.trim());
    setMessage('');
    refresh();
    toast({ title: 'Message sent', description: `Sent to ${request.applicantEmail}.` });
  };

  const handleMarkReceived = () => {
    attachRequestedDocument(request.id);
    refresh();
    toast({ title: 'Document received', description: 'The uploaded file is now available to review.' });
  };

  const handleCancel = () => {
    updateDocumentRequestStatus(request.id, 'cancelled');
    refresh();
    toast({ title: 'Request cancelled' });
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{request.documentType}</h1>
          <p className="text-sm text-muted-foreground">
            {request.applicantName} · {request.applicantEmail} · Application {request.applicationId}
          </p>
        </div>
        <Badge className="capitalize" variant={request.status === 'accepted' ? 'default' : 'secondary'}>
          {request.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Document</CardTitle>
            <CardDescription>
              {REASON_LABELS[request.reason]} · Requested{' '}
              {new Date(request.requestedAt).toLocaleString()}
              {request.dueDate ? ` · Due ${new Date(request.dueDate).toLocaleDateString()}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {file ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} · Uploaded {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
                <div className="h-[min(52vh,520px)] rounded-lg border border-border bg-muted/40">
                  <object data={file.url} className="h-full w-full rounded-lg" aria-label={`Preview of ${file.name}`}>
                    <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                      Preview not available. Use Download to view the file.
                    </div>
                  </object>
                </div>
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-center">
                <Clock className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Waiting for {request.applicantName} to upload this document.
                </p>
                <Button size="sm" variant="outline" onClick={handleMarkReceived}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as received
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Message to applicant</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note for the applicant..."
                  className="min-h-[90px]"
                />
              </div>
              <Button className="w-full" variant="outline" onClick={handleSendMessage}>
                <Mail className="mr-2 h-4 w-4" />
                Send communication
              </Button>
              <Button className="w-full" variant="outline" onClick={handleReRequest}>
                <Send className="mr-2 h-4 w-4" />
                Request again
              </Button>
              {request.status !== 'accepted' && (
                <Button className="w-full" onClick={handleAccept} disabled={!file}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept document
                </Button>
              )}
              {request.status === 'pending' && (
                <Button className="w-full" variant="ghost" onClick={handleCancel}>
                  Cancel request
                </Button>
              )}
              <Separator />
              {onClose && (
                <Button className="w-full" variant="ghost" onClick={onClose}>
                  Close
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request thread</CardTitle>
              <CardDescription>Complete history of this document request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(request.thread || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
              ) : (
                [...(request.thread || [])].reverse().map((ev) => {
                  const Icon = EVENT_ICONS[ev.type] || Clock;
                  return (
                    <div key={ev.id} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm">{ev.message}</p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {ev.actor} · {new Date(ev.at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequestViewer;
