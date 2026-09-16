import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Smartphone, Inbox } from 'lucide-react';
import { CommunicationChannel, CommunicationTemplate } from '@/types/communication';
import { CHANNELS, CHANNEL_LABELS } from '@/lib/communicationTemplates';

export const channelIcons: Record<CommunicationChannel, typeof Mail> = {
  email: Mail,
  sms: Smartphone,
  whatsapp: MessageSquare,
  inbox: Inbox,
};

export function ChannelBadges({ template }: { template: CommunicationTemplate }) {
  const active = CHANNELS.filter((c) => template.channels[c]?.enabled);
  if (!active.length) {
    return <span className="text-xs text-muted-foreground">No channel enabled</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {active.map((channel) => {
        const Icon = channelIcons[channel];
        return (
          <Badge key={channel} variant="secondary" className="gap-1 font-normal">
            <Icon className="h-3 w-3" />
            {CHANNEL_LABELS[channel]}
          </Badge>
        );
      })}
    </div>
  );
}
