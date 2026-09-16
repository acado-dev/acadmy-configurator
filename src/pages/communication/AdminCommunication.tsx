import { TemplateListView } from '@/components/communication/TemplateListView';
import { TemplateEditorView } from '@/components/communication/TemplateEditorView';
import { TriggerPointsView } from '@/components/communication/TriggerPointsView';
import { MessageLogView } from '@/components/communication/MessageLogView';
import { InboxView } from '@/components/communication/InboxView';

const BASE = '/communication/templates';

export const AdminTemplates = () => <TemplateListView scope="admin" basePath={BASE} />;
export const AdminTemplateEditor = () => (
  <TemplateEditorView scope="admin" basePath={BASE} />
);
export const AdminTriggerPoints = () => (
  <TriggerPointsView scope="admin" basePath={BASE} />
);
export const AdminMessageLog = () => <MessageLogView basePath={BASE} />;
export const AdminInbox = () => (
  <InboxView scope="admin" senderName="ACADO Platform Team" title="Internal Inbox" />
);
