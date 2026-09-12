import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle2,
  FileText,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Award,
  Clock,
  CheckCheck,
  ArrowRight,
  Inbox,
} from 'lucide-react';
import { useUserNotifications, NotificationType } from '@/hooks/useUserNotifications';
import ApplicantDocumentRequestDialog from '@/components/documents/ApplicantDocumentRequestDialog';
import {
  DocumentRequest,
  REASON_LABELS,
  getDocumentRequests,
  seedDocumentRequestsIfEmpty,
} from '@/lib/documentRequests';
import { Upload, MessageSquare as CommentIcon } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllRead } = useUserNotifications();
  const [docRequests, setDocRequests] = useState<DocumentRequest[]>([]);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);

  const loadRequests = () => {
    seedDocumentRequestsIfEmpty();
    setDocRequests(getDocumentRequests().filter((r) => r.status !== 'cancelled'));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingDocs = docRequests.filter((r) => r.status === 'pending');

  const statusLabel = (r: DocumentRequest) =>
    r.status === 'pending'
      ? 'Awaiting your upload'
      : r.status === 'received'
      ? 'Submitted · under review'
      : 'Accepted';

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
      offer: { icon: Award, color: 'text-green-600', bg: 'bg-green-50' },
      status_change: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
      interview: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
      document_request: { icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
      action_required: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
      message: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
      reminder: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    };
    return icons[type] || icons.message;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderNotification = (notif: typeof notifications[0]) => {
    const { icon: Icon, color, bg } = getNotificationIcon(notif.type);
    const linkedRequest =
      notif.type === 'document_request'
        ? docRequests.find((r) => r.applicationId === notif.applicationId && r.status === 'pending') ||
          docRequests.find((r) => r.applicationId === notif.applicationId)
        : undefined;
    const handleOpen = () => {
      markAsRead(notif.id);
      if (linkedRequest) {
        setOpenRequestId(linkedRequest.id);
        return;
      }
      if (notif.actionRoute) navigate(notif.actionRoute);
    };
    return (
      <div
        key={notif.id}
        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
          !notif.isRead ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
        }`}
        onClick={handleOpen}
      >
        <div className={`p-2.5 rounded-lg shrink-0 ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notif.title}
            </h4>
            <div className="flex items-center gap-2 shrink-0">
              {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(notif.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {notif.courseName}
            </Badge>
            <span className="text-xs text-muted-foreground">• {notif.universityName}</span>
          </div>
          {notif.isActionRequired && notif.actionLabel && (
            <Button
              size="sm"
              className="mt-3"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notif.id);
                if (notif.actionRoute) navigate(notif.actionRoute);
              }}
            >
              {notif.actionLabel}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const actionNotifications = notifications.filter(n => n.isActionRequired);
  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on your application progress
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-1">
            <Inbox className="h-4 w-4" />
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-1">
            <Bell className="h-4 w-4" />
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="action" className="gap-1">
            <AlertTriangle className="h-4 w-4" />
            Action Required ({actionNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(renderNotification)
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {unreadNotifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>All caught up!</p>
                    </div>
                  ) : (
                    unreadNotifications.map(renderNotification)
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {actionNotifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No pending actions</p>
                    </div>
                  ) : (
                    actionNotifications.map(renderNotification)
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
