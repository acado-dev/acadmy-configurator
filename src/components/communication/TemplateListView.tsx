import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Building2,
  Copy,
  Edit,
  Lock,
  MessageSquareDashed,
  Plus,
  RotateCcw,
  Search,
  Send,
  Trash2,
  Unlock,
  Wand2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunicationChannel, CommunicationTemplate } from '@/types/communication';
import {
  CHANNELS,
  CHANNEL_LABELS,
  customizeForUniversity,
  deleteTemplate,
  duplicateTemplate,
  getTemplates,
  getTemplatesForUniversity,
  getUniversityOptions,
  revertToPlatformDefault,
  setTemplateAssignment,
  setTemplateLocked,
  templateAssignment,
  upsertTemplate,
} from '@/lib/communicationTemplates';
import { AssignTemplateDialog } from './AssignTemplateDialog';
import {
  COMMUNICATION_TRIGGERS,
  TRIGGER_CATEGORY_LABELS,
  getTrigger,
} from '@/lib/communicationTriggers';
import { ChannelBadges } from './ChannelBadges';

interface Props {
  scope: 'admin' | 'university';
  basePath: string;
}

export function TemplateListView({ scope, basePath }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [triggerFilter, setTriggerFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [assignTemplate, setAssignTemplate] = useState<CommunicationTemplate | null>(null);
  const [universityCount, setUniversityCount] = useState(0);

  const reload = () =>
    setTemplates(scope === 'university' ? getTemplatesForUniversity() : getTemplates());

  useEffect(() => {
    reload();
    setUniversityCount(getUniversityOptions().length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const overrideByPlatformId = useMemo(() => {
    const map: Record<string, CommunicationTemplate> = {};
    templates
      .filter((t) => t.owner === 'university' && t.basedOnId)
      .forEach((t) => {
        map[t.basedOnId!] = t;
      });
    return map;
  }, [templates]);

  const visible = useMemo(() => {
    let list = templates;
    if (scope === 'university') {
      // Only templates assigned to this university (fixed platform ones are excluded),
      // shown with their override state plus university-only templates.
      list = templates.filter((t) => t.owner === 'platform' || !t.basedOnId);
    }
    return list.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (getTrigger(t.triggerKey)?.label ?? '').toLowerCase().includes(q);
      const matchesTrigger = triggerFilter === 'all' || t.triggerKey === triggerFilter;
      const matchesChannel =
        channelFilter === 'all' ||
        t.channels[channelFilter as CommunicationChannel]?.enabled;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesTrigger && matchesChannel && matchesStatus;
    });
  }, [templates, scope, search, triggerFilter, channelFilter, statusFilter]);

  const handleDuplicate = (id: string) => {
    duplicateTemplate(id);
    reload();
    toast({ title: 'Template duplicated' });
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    reload();
    setDeleteId(null);
    toast({ title: 'Template deleted' });
  };

  const handleCustomize = (id: string) => {
    const copy = customizeForUniversity(id);
    reload();
    if (copy) navigate(`${basePath}/${copy.id}`);
  };

  const handleRevert = (platformId: string) => {
    const override = overrideByPlatformId[platformId];
    if (!override) return;
    revertToPlatformDefault(override.id);
    reload();
    toast({ title: 'Reverted to platform default' });
  };

  const toggleStatus = (template: CommunicationTemplate) => {
    const updated = {
      ...template,
      status: template.status === 'Active' ? 'Inactive' : 'Active',
    } as CommunicationTemplate;
    upsertTemplate(updated);
    reload();
  };

  const toggleLocked = (template: CommunicationTemplate) => {
    setTemplateLocked(template.id, !template.locked);
    reload();
    toast({
      title: template.locked
        ? 'Universities can now customise this template'
        : 'Template fixed for all universities',
      description: template.locked
        ? undefined
        : 'Universities will use this wording as it is and cannot edit it.',
    });
  };

  const saveAssignment = (mode: 'all' | 'selected', universityIds: string[]) => {
    if (!assignTemplate) return;
    setTemplateAssignment(assignTemplate.id, { mode, universityIds });
    setAssignTemplate(null);
    reload();
    toast({
      title: 'Assignment updated',
      description:
        mode === 'all'
          ? 'Available to all universities.'
          : `Available to ${universityIds.length} selected university${
              universityIds.length === 1 ? '' : 's'
            }.`,
    });
  };

  const assignmentSummary = (template: CommunicationTemplate) => {
    const assignment = templateAssignment(template);
    return assignment.mode === 'all'
      ? `All universities (${universityCount})`
      : `${assignment.universityIds.length} selected`;
  };

  const activeCount = templates.filter((t) => t.status === 'Active').length;
  const overrideCount = Object.keys(overrideByPlatformId).length;
  const lockedCount = templates.filter((t) => t.locked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {scope === 'admin' ? 'Communication Templates' : 'Communication Templates'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {scope === 'admin'
              ? 'Configure the message that goes out on every platform trigger, mark templates as fixed and choose which universities get them.'
              : 'These are the templates assigned to your university. Use them as they are, or customise them.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`${basePath}/triggers`)}>
            <Wand2 className="mr-2 h-4 w-4" />
            Trigger Points
          </Button>
          {scope === 'admin' && (
            <Button variant="outline" onClick={() => navigate(`${basePath}/log`)}>
              <Send className="mr-2 h-4 w-4" />
              Message Log
            </Button>
          )}
          <Button onClick={() => navigate(`${basePath}/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: scope === 'admin' ? 'Templates' : 'Assigned to you',
            value: templates.length,
          },
          { label: 'Active', value: activeCount },
          scope === 'admin'
            ? { label: 'Fixed (not editable by universities)', value: lockedCount }
            : { label: 'Trigger points', value: COMMUNICATION_TRIGGERS.length },
          {
            label: scope === 'admin' ? 'University overrides' : 'Customised by you',
            value: overrideCount,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex min-w-[220px] flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates or trigger points..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Select value={triggerFilter} onValueChange={setTriggerFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Trigger" />
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
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Channel" />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Trigger point</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Status</TableHead>
                {scope === 'admin' && <TableHead>Assigned to</TableHead>}
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    <MessageSquareDashed className="mx-auto mb-2 h-6 w-6" />
                    No templates match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((template) => {
                  const trigger = getTrigger(template.triggerKey);
                  const override = overrideByPlatformId[template.id];
                  const effective = scope === 'university' && override ? override : template;
                  return (
                    <TableRow key={template.id}>
                      <TableCell>
                        <p className="font-medium">{effective.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {effective.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trigger?.label ?? template.triggerKey}</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {trigger ? TRIGGER_CATEGORY_LABELS[trigger.category] : '—'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <ChannelBadges template={effective} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2"
                          onClick={() => toggleStatus(effective)}
                        >
                          <Badge variant={effective.status === 'Active' ? 'default' : 'secondary'}>
                            {effective.status}
                          </Badge>
                        </Button>
                      </TableCell>
                      {scope === 'admin' && (
                        <TableCell>
                          {template.owner === 'platform' ? (
                            <button
                              className="text-left"
                              onClick={() => setAssignTemplate(template)}
                            >
                              <span className="flex items-center gap-1 text-sm hover:underline">
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                {assignmentSummary(template)}
                              </span>
                            </button>
                          ) : (
                            <span className="text-sm text-muted-foreground">Own university</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        {template.locked && (
                          <Badge className="mb-1 gap-1 bg-primary/10 text-primary hover:bg-primary/10">
                            <Lock className="h-3 w-3" />
                            Fixed
                          </Badge>
                        )}
                        {template.owner === 'platform' ? (
                          override ? (
                            <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">
                              Customised
                            </Badge>
                          ) : (
                            <Badge variant="outline">Platform default</Badge>
                          )
                        ) : (
                          <Badge variant="outline">University template</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {scope === 'university' && template.owner === 'platform' && !override && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCustomize(template.id)}
                            >
                              Customise
                            </Button>
                          )}
                          {scope === 'university' && override && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit your version"
                                onClick={() => navigate(`${basePath}/${override.id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Revert to platform default"
                                onClick={() => handleRevert(template.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {(scope === 'admin' || template.owner === 'university') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() => navigate(`${basePath}/${template.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Duplicate"
                            onClick={() => handleDuplicate(template.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {(scope === 'admin' || template.owner === 'university') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => setDeleteId(template.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template</AlertDialogTitle>
            <AlertDialogDescription>
              This template will no longer be used for its trigger point. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
