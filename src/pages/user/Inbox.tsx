import { InboxView } from '@/components/communication/InboxView';

const UserInbox = () => {
  const stored = localStorage.getItem('userAuth');
  const user = stored ? JSON.parse(stored) : null;
  const name = user?.name || user?.email || 'Me';
  return <InboxView scope="student" senderName={name} title="Inbox" />;
};

export default UserInbox;
