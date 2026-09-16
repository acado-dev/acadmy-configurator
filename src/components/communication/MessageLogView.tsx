import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Search, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MessageLogEntry } from '@/types/communication';
import { CHANNELS, CHANNEL_LABELS } from '@/lib/communicationTemplates';
import { COMMUNICATION_TRIGGERS, getTriggerLabel } from '@/lib/communicationTriggers';
import { clearMessageLog, getMessageLog } from '@/lib/messaging';
import { channelIcons } from './ChannelBadges';

export function MessageLogView({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MessageLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const [selected, setSelected] = useState<MessageLogEntry | null>(null);

  useEffect(() => setEntries(getMessageLog()), []);

  const filtered = useMemo(
    () =>
      entries.filter((entry) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          entry.recipientName.toLowerCase().includes(q) ||
          entry.recipientEmail.toLowerCase().includes(q) ||
          entry.subject.toLowerCase().includes(q);
        const matchesChannel = channelFilter === 'all' || entry.channel === channelFilter;
        const matchesTrigger = triggerFilter === 'all' || entry.triggerKey === triggerFilter;
        return matchesSearch && matchesChannel && matchesTrigger;
      }),
    [entries, search, channelFilter, triggerFilter]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Message Log</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Every message the platform generated, on every channel.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearMessageLog();
            setEntries([]);
            toast({ title: 'Message log cleared' });
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear log
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex min-w-[220px] flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipient or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              {CHANNELS.map((c) => (
                <SelectItem key={c} value={c}>
                  {CHANNEL_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={triggerFilter} onValueChange={setTriggerFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All triggers</SelectItem>
              {COMMUNICATION_TRIGGERS.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No messages yet. Fire a trigger or send a test message.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((entry) => {
                  const Icon = channelIcons[entry.channel];
                  return (
                    <TableRow
                      key={entry.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(entry)}
                    >
                      <TableCell>
                        <p className="font-medium">{entry.recipientName}</p>
                        <p className="text-xs text-muted-foreground">{entry.recipientEmail}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTriggerLabel(entry.triggerKey)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <Icon className="h-3 w-3" />
                          {CHANNEL_LABELS[entry.channel]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate">{entry.subject}</TableCell>
                      <TableCell>
                        <Badge variant={entry.status === 'Sent' ? 'default' : 'destructive'}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(entry.sentAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{CHANNEL_LABELS[selected.channel]}</Badge>
                <Badge variant="outline">{getTriggerLabel(selected.triggerKey)}</Badge>
                <span>
                  To {selected.recipientName} · {selected.recipientEmail}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none rounded-lg border p-4 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selected.body }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
