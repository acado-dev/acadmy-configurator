// Prototype store for acceptance letter records, keyed by application ID.
export interface AcceptanceLetterRecord {
  applicationId: string;
  status: 'sent';
  sentAt: string;
  sentBy: string;
  note: string;
  resendCount: number;
}

const KEY = 'acado_acceptance_letters';

export function loadAcceptanceLetters(): Record<string, AcceptanceLetterRecord> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function getLetterRecord(applicationId: string): AcceptanceLetterRecord | null {
  return loadAcceptanceLetters()[applicationId] || null;
}

export function sendAcceptanceLetter(
  applicationId: string,
  sentBy: string,
  note = ''
): AcceptanceLetterRecord {
  const letters = loadAcceptanceLetters();
  const existing = letters[applicationId];
  const record: AcceptanceLetterRecord = {
    applicationId,
    status: 'sent',
    sentAt: new Date().toISOString(),
    sentBy,
    note,
    resendCount: existing ? existing.resendCount + 1 : 0,
  };
  letters[applicationId] = record;
  localStorage.setItem(KEY, JSON.stringify(letters));
  return record;
}
