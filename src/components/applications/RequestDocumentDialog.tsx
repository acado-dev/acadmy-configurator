import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DOCUMENT_TYPES,
  DocumentRequestReason,
  REASON_HINTS,
  REASON_LABELS,
} from '@/lib/documentRequests';

interface RequestDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  onSubmit: (data: {
    documentType: string;
    reason: DocumentRequestReason;
    message: string;
    dueDate?: string;
  }) => void;
}

const RequestDocumentDialog = ({ open, onOpenChange, applicantName, onSubmit }: RequestDocumentDialogProps) => {
  const [documentType, setDocumentType] = useState('');
  const [customType, setCustomType] = useState('');
  const [reason, setReason] = useState<DocumentRequestReason>('new_requirement');
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDocumentType('');
      setCustomType('');
      setReason('new_requirement');
      setMessage('');
      setDueDate('');
      setError('');
    }
  }, [open]);

  const resolvedType = documentType === 'Other' ? customType.trim() : documentType;

  const handleSubmit = () => {
    if (!resolvedType) {
      setError(documentType === 'Other' ? 'Please name the document you need.' : 'Please select a document type.');
      return;
    }
    onSubmit({ documentType: resolvedType, reason, message: message.trim(), dueDate: dueDate || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Document</DialogTitle>
          <DialogDescription>
            Ask {applicantName || 'the applicant'} for a document needed to progress this application.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Document type</Label>
            <Select value={documentType} onValueChange={(v) => { setDocumentType(v); setError(''); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {documentType === 'Other' && (
              <Input
                placeholder="Name the document"
                value={customType}
                onChange={(e) => { setCustomType(e.target.value); setError(''); }}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Reason for the request</Label>
            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as DocumentRequestReason)}
              className="space-y-2"
            >
              {(Object.keys(REASON_LABELS) as DocumentRequestReason[]).map((key) => (
                <label
                  key={key}
                  htmlFor={`reason-${key}`}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-accent"
                >
                  <RadioGroupItem value={key} id={`reason-${key}`} className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">{REASON_LABELS[key]}</span>
                    <span className="block text-xs text-muted-foreground">{REASON_HINTS[key]}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-request-message">Message to applicant</Label>
            <Textarea
              id="doc-request-message"
              placeholder="Add instructions, e.g. upload a clear colour scan of all pages."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[90px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-request-due">Submit by (optional)</Label>
            <Input
              id="doc-request-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDocumentDialog;
