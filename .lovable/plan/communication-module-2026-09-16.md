# Communication Module

A single communication system covering message templates, trigger points, and an in-platform inbox for all three portals.

## 1. Communication Templates (Super Admin)

New menu group "Communication" with:

- **Templates** — list with search and filters (trigger event, channel, status), plus create/edit/duplicate/delete.
- **Trigger Points** — the catalogue of events, each mapped to the templates that fire on it.
- **Message Log** — every message generated (recipient, channel, trigger, status, timestamp) with a preview.

Template configuration screen:

- Name, description, status (Active/Inactive)
- Trigger event (from the catalogue below)
- Channels: Email, SMS, WhatsApp, In-app Inbox — each channel can be switched on/off individually, with its own content
  - Email: subject + rich text body
  - SMS: plain text with character counter
  - WhatsApp: plain text, optional header/footer
  - Inbox: title + rich text body
- Variables panel (click to insert): candidate name, email, mobile, course, university, event name, event date, interview date/time, meeting link, document name, application ID, deadline, verification link, reset link
- Live preview per channel with sample data

Trigger catalogue:

- **Account**: New user registration (welcome), Account verification, Forgot password, Password changed
- **Events**: New event published, Event schedule set, Event updated, Event reminder, Registration confirmed, Activity/stage opened
- **Applications**: Application submitted, Shortlisted, Document requested, Document received/accepted, Assessment invite, Assignment invite, Interview scheduled, Interview rescheduled, On hold, Offer / acceptance letter, Rejected, Enrollment confirmed

## 2. University Admin usage

Under Engagement → "Communication Templates":

- Sees all platform templates as read-only defaults, with a badge showing whether it is the platform default or overridden by the university.
- "Use as is" (inherit) or "Customize" — customizing creates a university-owned copy, editable exactly like the admin editor, with "Revert to platform default".
- Can toggle which channels the university actually sends on, and disable a trigger for itself.
- Can create university-only templates for its own triggers.

## 3. Internal messaging / Inbox

- **Student inbox** at `/user/inbox`: folders (Inbox, Sent, Archived), unread count in the top nav, list + reading pane, per-message channel and trigger labels, reply to university/admin, mark read/unread, archive, delete.
- **University admin inbox** at `/university/inbox` and **super admin inbox** at `/inbox`: same layout, threads with students, compose new message (pick recipient, template optional, prefills from template).
- Threaded conversations: a triggered inbox message starts a thread, replies stay in it.
- Every trigger that has the Inbox channel enabled creates a real inbox message, so the platform side of the workflow is visible without email.

## 4. Wiring triggers into existing flows

Trigger points fire from the existing screens, creating messages in the log and inbox:

- Registration and login/forgot-password screens
- Event create/update and event stage screens
- Application review: shortlist, document request, interview scheduling, acceptance letter
- Selection process status changes (Accepted / Rejected / On Hold)

## Technical notes

- New types in `src/types/communication.ts`; storage helpers in `src/lib/communicationTemplates.ts`, `src/lib/messaging.ts`, and a dispatch helper `triggerCommunication(triggerKey, context)`.
- Persistence stays on `localStorage` with seeded default templates for every trigger, matching the existing modules.
- Reuse the existing rich-text editor pattern from the mail-template dialog, shadcn tabs for channels, and existing badge/table patterns.
- Existing Mail Template and Bulk Email screens stay where they are; the new templates module is additive and reuses the same variable syntax `{{name}}`.
