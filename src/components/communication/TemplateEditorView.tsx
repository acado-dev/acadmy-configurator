import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ChannelContent,
  CommunicationChannel,
  CommunicationTemplate,
} from '@/types/communication';
import {
  CHANNELS,
  CHANNEL_LABELS,
  emptyChannels,
  getTemplateById,
  renderTemplate,
  upsertTemplate,
} from '@/lib/communicationTemplates';
import {
  ALL_VARIABLES,
  COMMUNICATION_TRIGGERS,
  SAMPLE_CONTEXT,
  TRIGGER_CATEGORY_LABELS,
  getTrigger,
} from '@/lib/communicationTriggers';
import { triggerCommunication, triggerSummary } from '@/lib/messaging';
import { channelIcons } from './ChannelBadges';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }],
    ['link'],
    ['clean'],
  ],
};

interface Props {
  scope: 'admin' | 'university';
  basePath: string;
}

export function TemplateEditorView({ scope, basePath }: Props) {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !templateId || templateId === 'new';

  const [template, setTemplate] = useState<CommunicationTemplate>(() => ({
    id: `tpl-${Date.now()}`,
    name: '',
    description: '',
    triggerKey: '',
    status: 'Active',
    owner: scope === 'admin' ? 'platform' : 'university',
    channels: emptyChannels(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: scope === 'admin' ? 'admin@acado.ai' : 'university@acado.ai',
  }));
  const [activeChannel, setActiveChannel] = useState<CommunicationChannel>('email');

  useEffect(() => {
    if (isNew) return;
    const existing = getTemplateById(templateId!);
    if (existing) setTemplate(existing);
  }, [templateId, isNew]);

  const trigger = getTrigger(template.triggerKey);
  const variables = useMemo(
    () => (trigger ? trigger.variables : ALL_VARIABLES),
    [trigger]
  );

  const setChannel = (channel: CommunicationChannel, patch: Partial<ChannelContent>) =>
    setTemplate((prev) => ({
      ...prev,
      channels: { ...prev.channels, [channel]: { ...prev.channels[channel], ...patch } },
    }));

  const insertVariable = (variable: string) => {
    const token = `{{${variable}}}`;
    const current = template.channels[activeChannel];
    setChannel(activeChannel, { body: `${current.body || ''}${token}` });
  };

  const handleSave = () => {
    if (!template.name.trim() || !template.triggerKey) {
      toast({
        title: 'Missing details',
        description: 'A template needs a name and a trigger point.',
        variant: 'destructive',
      });
      return;
    }
    upsertTemplate(template);
    toast({ title: isNew ? 'Template created' : 'Template saved' });
    navigate(basePath);
  };

  const handleTestSend = () => {
    upsertTemplate(template);
    const result = triggerCommunication(template.triggerKey, SAMPLE_CONTEXT, {
      scope: scope === 'admin' ? 'platform' : 'university',
    });
    toast({ title: 'Test message dispatched', description: triggerSummary(result) });
  };

  const preview = (content?: string) => renderTemplate(content ?? '', SAMPLE_CONTEXT);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? 'New Communication Template' : template.name || 'Edit Template'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Configure the content for each channel this template should go out on.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestSend} disabled={!template.triggerKey}>
            <Send className="mr-2 h-4 w-4" />
            Send test
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save template
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Template details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Template name *</Label>
                <Input
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="e.g. Shortlisted notification"
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger point *</Label>
                <Select
                  value={template.triggerKey}
                  onValueChange={(value) => setTemplate({ ...template, triggerKey: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="When should this be sent?" />
                  </SelectTrigger>
                  <SelectContent>
                    {(['account', 'events', 'applications'] as const).map((category) => (
                      <SelectGroup key={category}>
                        <SelectLabel>{TRIGGER_CATEGORY_LABELS[category]}</SelectLabel>
                        {COMMUNICATION_TRIGGERS.filter((t) => t.category === category).map((t) => (
                          <SelectItem key={t.key} value={t.key}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Where and when this template is used..."
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Template active</p>
                <p className="text-xs text-muted-foreground">
                  Inactive templates are skipped when the trigger fires.
                </p>
              </div>
              <Switch
                checked={template.status === 'Active'}
                onCheckedChange={(checked) =>
                  setTemplate({ ...template, status: checked ? 'Active' : 'Inactive' })
                }
              />
            </div>
            {trigger && (
              <p className="text-xs text-muted-foreground">
                {trigger.description}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Click to add to the {CHANNEL_LABELS[activeChannel]} content.
            </p>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Badge
                  key={variable}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => insertVariable(variable)}
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
            <Separator />
            <p className="text-xs text-muted-foreground">
              Previews below use sample data such as {SAMPLE_CONTEXT.name}.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeChannel}
            onValueChange={(value) => setActiveChannel(value as CommunicationChannel)}
          >
            <TabsList>
              {CHANNELS.map((channel) => {
                const Icon = channelIcons[channel];
                return (
                  <TabsTrigger key={channel} value={channel} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {CHANNEL_LABELS[channel]}
                    {template.channels[channel]?.enabled && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {CHANNELS.map((channel) => {
              const content = template.channels[channel];
              const richText = channel === 'email' || channel === 'inbox';
              return (
                <TabsContent key={channel} value={channel} className="space-y-4 pt-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        Send on {CHANNEL_LABELS[channel]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {channel === 'inbox'
                          ? 'Delivers the message to the platform inbox of the recipient.'
                          : `Turn on to include ${CHANNEL_LABELS[channel]} when this trigger fires.`}
                      </p>
                    </div>
                    <Switch
                      checked={content.enabled}
                      onCheckedChange={(checked) => setChannel(channel, { enabled: checked })}
                    />
                  </div>

                  {richText && (
                    <div className="space-y-2">
                      <Label>{channel === 'email' ? 'Email subject' : 'Message title'}</Label>
                      <Input
                        value={content.subject ?? ''}
                        onChange={(e) => setChannel(channel, { subject: e.target.value })}
                        placeholder="e.g. You have been shortlisted for {{course}}"
                      />
                    </div>
                  )}

                  {channel === 'whatsapp' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Header (optional)</Label>
                        <Input
                          value={content.header ?? ''}
                          onChange={(e) => setChannel(channel, { header: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Footer (optional)</Label>
                        <Input
                          value={content.footer ?? ''}
                          onChange={(e) => setChannel(channel, { footer: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Content</Label>
                    {richText ? (
                      <div className="rounded-lg border bg-background">
                        <ReactQuill
                          theme="snow"
                          value={content.body}
                          onChange={(value) => setChannel(channel, { body: value })}
                          modules={quillModules}
                        />
                      </div>
                    ) : (
                      <>
                        <Textarea
                          rows={5}
                          value={content.body}
                          onChange={(e) => setChannel(channel, { body: e.target.value })}
                          placeholder={`Write the ${CHANNEL_LABELS[channel]} message...`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {content.body.length} characters
                          {channel === 'sms' &&
                            ` · ${Math.max(1, Math.ceil(content.body.length / 160))} SMS`}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Eye className="h-4 w-4" />
                      Preview with sample data
                    </div>
                    {richText && content.subject && (
                      <p className="mb-2 text-sm font-semibold">{preview(content.subject)}</p>
                    )}
                    {channel === 'whatsapp' && content.header && (
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        {preview(content.header)}
                      </p>
                    )}
                    {richText ? (
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: preview(content.body) }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{preview(content.body)}</p>
                    )}
                    {channel === 'whatsapp' && content.footer && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {preview(content.footer)}
                      </p>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
