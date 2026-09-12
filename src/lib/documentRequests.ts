// Persisted document requests raised by admins from the Application Review screen

export type DocumentRequestReason = 'new_requirement' | 'missing' | 'invalid';

export type DocumentRequestStatus = 'pending' | 'received' | 'accepted' | 'cancelled';

export interface RequestedDocumentFile {
  name: string;
  size: string;
  url: string;
  uploadedAt: string;
}

export interface DocumentRequest {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  documentType: string;
  reason: DocumentRequestReason;
  message: string;
  dueDate?: string;
  status: DocumentRequestStatus;
  requestedAt: string;
  updatedAt: string;
  requestCount?: number;
  uploadedDocument?: RequestedDocumentFile;
}


export const DOCUMENT_TYPES: string[] = [
  'Passport / ID Proof',
  'Academic Transcript',
  'Degree Certificate',
  'Mark Sheets',
  'English Proficiency Score (IELTS/TOEFL)',
  'Standardised Test Score (GRE/GMAT)',
  'Statement of Purpose',
  'Letter of Recommendation',
  'Resume / CV',
  'Work Experience Letter',
  'Financial / Bank Statement',
  'Photograph',
  'Medical Certificate',
  'Other',
];

export const REASON_LABELS: Record<DocumentRequestReason, string> = {
  new_requirement: 'New requirement',
  missing: 'Document missing',
  invalid: 'Document not valid',
};

export const REASON_HINTS: Record<DocumentRequestReason, string> = {
  new_requirement: 'An additional document is now required for this application.',
  missing: 'The applicant has not uploaded this document yet.',
  invalid: 'The uploaded document is unclear, expired or does not meet requirements.',
};

const KEY = 'applicationDocumentRequests';

const read = (): DocumentRequest[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DocumentRequest[]) : [];
  } catch {
    return [];
  }
};

const write = (rows: DocumentRequest[]) => {
  localStorage.setItem(KEY, JSON.stringify(rows));
};

export const getDocumentRequests = (applicationId?: string): DocumentRequest[] => {
  const rows = read();
  const filtered = applicationId ? rows.filter((r) => r.applicationId === applicationId) : rows;
  return filtered.sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
};

export const createDocumentRequest = (
  input: Omit<DocumentRequest, 'id' | 'status' | 'requestedAt' | 'updatedAt'>,
): DocumentRequest => {
  const now = new Date().toISOString();
  const request: DocumentRequest = {
    ...input,
    id: `DOCREQ-${Date.now()}`,
    status: 'pending',
    requestCount: 1,
    requestedAt: now,
    updatedAt: now,
  };
  write([...read(), request]);
  return request;
};

const patch = (id: string, changes: Partial<DocumentRequest>) => {
  write(
    read().map((r) =>
      r.id === id ? { ...r, ...changes, updatedAt: new Date().toISOString() } : r,
    ),
  );
};

// Simulates the applicant uploading the requested document
export const attachRequestedDocument = (id: string, file?: Partial<RequestedDocumentFile>) => {
  const existing = read().find((r) => r.id === id);
  const label = (existing?.documentType || 'Document').replace(/[^a-zA-Z0-9]+/g, '_');
  patch(id, {
    status: 'received',
    uploadedDocument: {
      name: file?.name || `${label}.pdf`,
      size: file?.size || '312 KB',
      url: file?.url || '/placeholder.svg',
      uploadedAt: file?.uploadedAt || new Date().toISOString(),
    },
  });
};

export const acceptRequestedDocument = (id: string) => patch(id, { status: 'accepted' });

export const reRequestDocument = (id: string, message?: string) => {
  const existing = read().find((r) => r.id === id);
  patch(id, {
    status: 'pending',
    reason: 'invalid',
    message: message ?? existing?.message ?? '',
    uploadedDocument: undefined,
    requestCount: (existing?.requestCount || 1) + 1,
    requestedAt: new Date().toISOString(),
  });
};


export const updateDocumentRequestStatus = (id: string, status: DocumentRequestStatus) => {
  write(
    read().map((r) => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r)),
  );
};
