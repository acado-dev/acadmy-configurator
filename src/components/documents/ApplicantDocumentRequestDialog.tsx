import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Upload,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DocumentRequest,
  DocumentRequestEvent,
  REASON_HINTS,
  REASON_LABELS,
  getDocumentRequestById,
  uploadRequestedDocumentByApplicant,
  addApplicantComment,
} from '@/lib/documentRequests';

const EVENT_ICONS: Record<DocumentRequestEvent['type'], React.ElementType> = {
  requested: Send,
  message: MessageSquare,
  uploaded: Upload,
  accepted: CheckCircle,
  cancelled: XCircle,
  note: Clock,
};

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

interface Props {
  requestId: string | null;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const ApplicantDocumentRequestDialog = ({ requestId, onOpenChange, onUpdate }: Props) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [request, setRequest] = useState<DocumentRequest | null>(null);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setRequest(requestId ? getDocumentRequestById(requestId) || null : null);
    setComment('');
    setSelectedFile(null);
  }, [requestId]);

  const refresh = () => {
    if (requestId) setRequest(getDocumentRequestById(requestId) || null);
    onUpdate?.();
  };

  const handleUpload = () => {
    if (!request || !selectedFile) {
      toast({ title: 'Choose a file first', variant: 'destructive' });
      return;
    }
    uploadRequestedDocumentByApplicant(
      request.id,
      {
        name: selectedFile.name,
        size: formatSize(selectedFile.size),
        url: URL.createObjectURL(selectedFile),
        uploadedAt: new Date().toISOString(),
      },
      comment,
    );
    setSelectedFile(null);
    setComment('');
    refresh();
    toast({
      title: 'Document submitted',
      description: 'The admissions team has been notified and will review it shortly.',
    });
  };

  const handleComment = () => {
    if (!request || !comment.trim()) {
      toast({ title: 'Write a comment first', variant: 'destructive' });
      return;
    }
    addApplicantComment(request.id, comment.trim());
    setComment('');
    refresh();
    toast({ title: 'Comment sent', description: 'Your message was sent to the admissions team.' });
  };

  const file = request?.uploadedDocument;
  const canUpload = request?.status === 'pending';

  return (
    <Dialog open={!!requestId} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        {!request ? (
          <DialogHeader>
            <DialogTitle>Request not found</DialogTitle>
            <DialogDescription>This document request is no longer available.</DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2">
                {request.documentType}
                <Badge className="capitalize" variant={request.status === 'accepted' ? 'default' : 'secondary'}>
                  {request.status === 'received' ? 'Submitted · under review' : request.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {REASON_LABELS[request.reason]} — {REASON_HINTS[request.reason]}
                {request.dueDate
                  ? ` Due by ${new Date(request.dueDate).toLocaleDateString()}.`
                  : ''}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {request.message && (
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                  {request.message}
                </div>
              )}

              {file && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.size} · Submitted {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={file.url} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      View
                    </a>
                  </Button>
                </div>
              )}

              {canUpload && (
                <div className="space-y-2">
                  <Label>Upload document</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    PDF, image or Word file. {selectedFile ? `Selected: ${selectedFile.name}` : ''}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Comment to admissions team</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note about this document..."
                  className="min-h-[90px]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {canUpload && (
                  <Button onClick={handleUpload} disabled={!selectedFile}>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit document
                  </Button>
                )}
                <Button variant="outline" onClick={handleComment}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send comment
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-sm font-medium">Request history</p>
                {(request.thread || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
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
                            {ev.actor === 'applicant' ? 'You' : ev.actor} ·{' '}
                            {new Date(ev.at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDocumentRequestDialog;
