import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Archive,
  ArchiveRestore,
  Inbox as InboxIcon,
  Mail,
  MailOpen,
  PenSquare,
  Search,
  Send,
  Trash2,
  Users,
} from 'lucide-react';
import { AudienceGroup, getAudienceGroups } from '@/lib/messageAudiences';
import { useToast } from '@/hooks/use-toast';
import { InboxMessage, InboxScope } from '@/types/communication';
import {
  deleteMessage,
  getInboxMessages,
  getThread,
  markMessageRead,
  markThreadRead,
  seedMessagingIfEmpty,
  sendInboxMessage,
  setMessageArchived,
  inboxPreview,
} from '@/lib/messaging';
import {
  getTemplates,
  renderTemplate,
  stripHtml,
} from '@/lib/communicationTemplates';
import { SAMPLE_CONTEXT, getTriggerLabel } from '@/lib/communicationTriggers';

interface Props {
  scope: InboxScope;
  senderName: string;
  title?: string;
}

type Folder = 'inbox' | 'sent' | 'archived';

export function InboxView({ scope, senderName, title }: Props) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [folder, setFolder] = useState<Folder>('inbox');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const emptyCompose = {
    mode: 'single' as 'single' | 'group',
    groupId: '',
    toName: '',
    toEmail: '',
    subject: '',
    body: '',
    templateId: 'none',
  };
  const [compose, setCompose] = useState(emptyCompose);
  const [audienceGroups, setAudienceGroups] = useState<AudienceGroup[]>([]);

  const refresh = () => setMessages(getInboxMessages());
  const resetCompose = () => {
    setCompose(emptyCompose);
    setComposeOpen(false);
  };

  useEffect(() => {
    seedMessagingIfEmpty();
    refresh();
    setAudienceGroups(getAudienceGroups());
  }, []);

  const selectedGroup = useMemo(
    () => audienceGroups.find((g) => g.id === compose.groupId),
    [audienceGroups, compose.groupId]
  );

  const scopeMessages = useMemo(() => {
    return messages.filter((m) =>
      scope === 'student' ? m.toScope === 'student' || m.fromScope === 'student' : true
    );
  }, [messages, scope]);

  const folderMessages = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = scopeMessages
      .filter((m) => {
        const isOutgoing = m.fromScope === scope;
        if (folder === 'archived') return m.archived;
        if (m.archived) return false;
        return folder === 'sent' ? isOutgoing : !isOutgoing;
      })
      .filter(
        (m) =>
          !q ||
          m.subject.toLowerCase().includes(q) ||
          stripHtml(m.body).toLowerCase().includes(q) ||
          m.fromName.toLowerCase().includes(q) ||
          m.toName.toLowerCase().includes(q) ||
          m.audience?.type.toLowerCase().includes(q) ||
          m.audience?.name.toLowerCase().includes(q) ||
          m.audience?.recipients.some((recipient) =>
            recipient.name.toLowerCase().includes(q)
          )
      )
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    if (folder !== 'sent') return filtered;
    const seenGroupMessages = new Set<string>();
    return filtered.filter((message) => {
      if (!message.groupMessageId) return true;
      if (seenGroupMessages.has(message.groupMessageId)) return false;
      seenGroupMessages.add(message.groupMessageId);
      return true;
    });
  }, [scopeMessages, folder, search, scope]);

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? folderMessages[0],
    [messages, selectedId, folderMessages]
  );

  const thread = useMemo(
    () => (selected ? getThread(selected.threadId) : []),
    [selected, messages]
  );

  const unreadCount = scopeMessages.filter(
    (m) => !m.read && !m.archived && m.fromScope !== scope
  ).length;

  const openMessage = (message: InboxMessage) => {
    setSelectedId(message.id);
    markThreadRead(message.threadId);
    refresh();
  };

  const handleReply = () => {
    if (!selected || !reply.trim()) return;
    const toStudent = selected.fromScope === 'student';
    sendInboxMessage({
      threadId: selected.threadId,
      fromName: senderName,
      fromScope: scope,
      toName: toStudent ? selected.fromName : selected.toName,
      toEmail: toStudent ? selected.toEmail : selected.toEmail,
      toScope: scope === 'student' ? 'university' : 'student',
      subject: selected.subject.startsWith('Re:')
        ? selected.subject
        : `Re: ${selected.subject}`,
      body: `<p>${reply.replace(/\n/g, '<br/>')}</p>`,
      triggerKey: selected.triggerKey,
    });
    setReply('');
    refresh();
    toast({ title: 'Reply sent' });
  };

  const handleCompose = () => {
    const body = compose.body.startsWith('<')
      ? compose.body
      : `<p>${compose.body.replace(/\n/g, '<br/>')}</p>`;

    if (!compose.subject.trim()) {
      toast({
        title: 'Missing details',
        description: 'A subject is needed.',
        variant: 'destructive',
      });
      return;
    }

    if (compose.mode === 'group') {
      const group = selectedGroup;
      if (!group) {
        toast({
          title: 'Pick a group',
          description: 'Choose who should receive this message.',
          variant: 'destructive',
        });
        return;
      }
      const groupMessageId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const audience = {
        id: group.id,
        type: group.type,
        name: group.name,
        recipients: group.recipients.map(({ name, email }) => ({ name, email })),
      };
      group.recipients.forEach((r) =>
        sendInboxMessage({
          fromName: senderName,
          fromScope: scope,
          toName: r.name,
          toEmail: r.email,
          toScope: r.scope,
          subject: compose.subject,
          body,
          audience,
          groupMessageId,
        })
      );
      resetCompose();
      refresh();
      toast({
        title: `Sent to ${group.recipients.length} recipient${
          group.recipients.length === 1 ? '' : 's'
        }`,
        description: group.label,
      });
      return;
    }

    if (!compose.toEmail.trim()) {
      toast({
        title: 'Missing details',
        description: 'A recipient email is needed.',
        variant: 'destructive',
      });
      return;
    }
    sendInboxMessage({
      fromName: senderName,
      fromScope: scope,
      toName: compose.toName || compose.toEmail,
      toEmail: compose.toEmail,
      toScope: 'student',
      subject: compose.subject,
      body,
    });
    resetCompose();
    refresh();
    toast({ title: 'Message sent' });
  };

  const applyTemplate = (templateId: string) => {
    setCompose((prev) => ({ ...prev, templateId }));
    if (templateId === 'none') return;
    const template = getTemplates().find((t) => t.id === templateId);
    if (!template) return;
    const content = template.channels.inbox;
    setCompose((prev) => ({
      ...prev,
      templateId,
      subject: renderTemplate(content.subject ?? template.name, {
        ...SAMPLE_CONTEXT,
        name: prev.toName || SAMPLE_CONTEXT.name,
      }),
      body: renderTemplate(content.body, {
        ...SAMPLE_CONTEXT,
        name: prev.toName || SAMPLE_CONTEXT.name,
      }),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title ?? 'Inbox'}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Messages from the platform and conversations with{' '}
            {scope === 'student' ? 'your universities' : 'candidates'}.
          </p>
        </div>
        {scope !== 'student' && (
          <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <PenSquare className="mr-2 h-4 w-4" />
                New message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>New message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Send to</Label>
                  <Tabs
                    value={compose.mode}
                    onValueChange={(v) =>
                      setCompose({ ...compose, mode: v as 'single' | 'group' })
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="single">One person</TabsTrigger>
                      <TabsTrigger value="group">A group of users</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {compose.mode === 'single' ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Recipient name</Label>
                      <Input
                        value={compose.toName}
                        onChange={(e) => setCompose({ ...compose, toName: e.target.value })}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recipient email *</Label>
                      <Input
                        value={compose.toEmail}
                        onChange={(e) => setCompose({ ...compose, toEmail: e.target.value })}
                        placeholder="jane.smith@example.com"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Group *</Label>
                    <Select
                      value={compose.groupId}
                      onValueChange={(groupId) => setCompose({ ...compose, groupId })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a group of users" />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.label} ({g.recipients.length})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedGroup && (
                      <p className="text-xs text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" />
                        {selectedGroup.description} — {selectedGroup.recipients.length}{' '}
                        recipient{selectedGroup.recipients.length === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Start from a template</Label>
                  <Select value={compose.templateId} onValueChange={applyTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Write from scratch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Write from scratch</SelectItem>
                      {getTemplates()
                        .filter((t) => t.channels.inbox?.enabled)
                        .map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input
                    value={compose.subject}
                    onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    rows={6}
                    value={stripHtml(compose.body) || compose.body}
                    onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setComposeOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCompose}>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[430px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-3 pb-3">
            <Tabs value={folder} onValueChange={(value) => setFolder(value as Folder)}>
              <TabsList className="w-full">
                <TabsTrigger value="inbox" className="flex-1 gap-1">
                  <InboxIcon className="h-3.5 w-3.5" />
                  Inbox
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1">
                  Sent
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 rounded-lg border px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[520px]">
              {folderMessages.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </p>
              ) : (
                folderMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => openMessage(message)}
                    className={`w-full border-b px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                      selected?.id === message.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        {folder === 'sent' && message.audience ? (
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant="secondary" className="text-[10px] font-medium">
                                {message.audience.type}
                              </Badge>
                              <span className="text-sm font-semibold">
                                {message.audience.name}
                              </span>
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {message.audience.recipients.length} recipients:
                              </span>{' '}
                              {message.audience.recipients.map((recipient) => recipient.name).join(', ')}
                            </p>
                          </div>
                        ) : (
                          <span
                            className={`block truncate text-sm ${
                              message.read ? 'font-normal' : 'font-semibold'
                            }`}
                          >
                            {folder === 'sent' ? `To: ${message.toName}` : message.fromName}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className={`truncate text-sm ${
                        message.read ? 'text-muted-foreground' : ''
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {inboxPreview(message.body)}
                    </p>
                    {message.triggerKey && (
                      <Badge variant="outline" className="mt-1 text-[10px] font-normal">
                        {getTriggerLabel(message.triggerKey)}
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          {selected ? (
            <>
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-lg">{selected.subject}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={selected.read ? 'Mark unread' : 'Mark read'}
                      onClick={() => {
                        markMessageRead(selected.id, !selected.read);
                        refresh();
                      }}
                    >
                      {selected.read ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={selected.archived ? 'Move to inbox' : 'Archive'}
                      onClick={() => {
                        setMessageArchived(selected.id, !selected.archived);
                        refresh();
                      }}
                    >
                      {selected.archived ? (
                        <ArchiveRestore className="h-4 w-4" />
                      ) : (
                        <Archive className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => {
                        deleteMessage(selected.id);
                        setSelectedId(null);
                        refresh();
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>From {selected.fromName}</span>
                  <span>·</span>
                  <span>To {selected.toName}</span>
                  {selected.triggerKey && (
                    <Badge variant="outline">{getTriggerLabel(selected.triggerKey)}</Badge>
                  )}
                  {selected.templateName && (
                    <Badge variant="secondary" className="font-normal">
                      {selected.templateName}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="max-h-[360px] pr-3">
                  <div className="space-y-4">
                    {thread.map((message) => (
                      <div key={message.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{message.fromName}</span>
                          <span>{new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: message.body }}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="space-y-2">
                  <Label>Reply</Label>
                  <Textarea
                    rows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your reply..."
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleReply} disabled={!reply.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Send reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-full min-h-[400px] flex-col items-center justify-center text-muted-foreground">
              <InboxIcon className="mb-2 h-8 w-8" />
              <p className="text-sm">Select a message to read it.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
