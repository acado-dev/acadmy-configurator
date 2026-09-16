import { TemplateListView } from '@/components/communication/TemplateListView';
import { TemplateEditorView } from '@/components/communication/TemplateEditorView';
import { TriggerPointsView } from '@/components/communication/TriggerPointsView';
import { MessageLogView } from '@/components/communication/MessageLogView';
import { InboxView } from '@/components/communication/InboxView';

const BASE = '/university/communication/templates';

export const UniversityTemplates = () => (
  <TemplateListView scope="university" basePath={BASE} />
);
export const UniversityTemplateEditor = () => (
  <TemplateEditorView scope="university" basePath={BASE} />
);
export const UniversityTriggerPoints = () => (
  <TriggerPointsView scope="university" basePath={BASE} />
);
export const UniversityMessageLog = () => <MessageLogView basePath={BASE} />;
export const UniversityInbox = () => (
  <InboxView scope="university" senderName="Admissions Office" title="Inbox" />
);
