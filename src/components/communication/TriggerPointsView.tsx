import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunicationTemplate, TriggerCategory } from '@/types/communication';
import { getTemplates } from '@/lib/communicationTemplates';
import {
  COMMUNICATION_TRIGGERS,
  SAMPLE_CONTEXT,
  TRIGGER_CATEGORY_LABELS,
} from '@/lib/communicationTriggers';
import { triggerCommunication, triggerSummary } from '@/lib/messaging';
import { ChannelBadges } from './ChannelBadges';

interface Props {
  scope: 'admin' | 'university';
  basePath: string;
}

export function TriggerPointsView({ scope, basePath }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);

  useEffect(() => setTemplates(getTemplates()), []);

  const categories: TriggerCategory[] = ['account', 'events', 'applications'];

  const handleTest = (triggerKey: string) => {
    const result = triggerCommunication(triggerKey, SAMPLE_CONTEXT, {
      scope: scope === 'admin' ? 'platform' : 'university',
    });
    toast({ title: 'Test message dispatched', description: triggerSummary(result) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trigger Points</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Every moment in the platform that can send a message, and the templates attached to it.
          </p>
        </div>
      </div>

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base">{TRIGGER_CATEGORY_LABELS[category]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {COMMUNICATION_TRIGGERS.filter((t) => t.category === category).map((trigger) => {
              const attached = templates.filter((t) => t.triggerKey === trigger.key);
              const universityOverride = attached.find((t) => t.owner === 'university');
              const effective =
                scope === 'university' && universityOverride
                  ? universityOverride
                  : attached.find((t) => t.owner === 'platform') ?? attached[0];
              return (
                <div
                  key={trigger.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-[240px] flex-1">
                    <p className="text-sm font-medium">{trigger.label}</p>
                    <p className="text-xs text-muted-foreground">{trigger.description}</p>
                  </div>
                  <div className="min-w-[180px]">
                    {effective ? (
                      <>
                        <ChannelBadges template={effective} />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {effective.name}
                          {universityOverride && scope === 'university' ? ' (customised)' : ''}
                        </p>
                      </>
                    ) : (
                      <Badge variant="outline">No template</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleTest(trigger.key)}>
                      <Send className="mr-2 h-3.5 w-3.5" />
                      Test
                    </Button>
                    {effective ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`${basePath}/${effective.id}`)}
                      >
                        Configure
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => navigate(`${basePath}/new`)}>
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
