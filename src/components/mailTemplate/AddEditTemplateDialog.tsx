import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmailTemplate, EmailPurpose } from '@/types/emailTemplate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const templateSchema = z.object({
  templateName: z.string().min(1, 'Template name is required'),
  emailSubject: z.string().min(1, 'Email subject is required'),
  description: z.string().min(1, 'Description is required'),
  mailBody: z.string().min(1, 'Mail body is required'),
  status: z.enum(['Active', 'Inactive']),
  purpose: z.string().min(1, 'Purpose is required'),
});

type TemplateFormData = z.infer<typeof templateSchema>;

const purposeOptions: EmailPurpose[] = [
  'Event Registration',
  'Course Reminder',
  'Payment Confirmation',
  'Generic Campaign',
  'Scholarship Notification',
  'Application Update',
  'Welcome Email',
  'Password Reset',
  'Course Completion',
  'Certificate Issued',
];

interface AddEditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate | null;
  onSave: (template: Partial<EmailTemplate>) => void;
}

export function AddEditTemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: AddEditTemplateDialogProps) {
  const [mailBody, setMailBody] = React.useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      status: 'Active',
    },
  });

  const selectedPurpose = watch('purpose');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (template) {
      reset({
        templateName: template.templateName,
        emailSubject: template.emailSubject,
        description: template.description,
        mailBody: template.mailBody,
        status: template.status,
        purpose: template.purpose,
      });
      setMailBody(template.mailBody);
    } else {
      reset({
        templateName: '',
        emailSubject: '',
        description: '',
        mailBody: '',
        status: 'Active',
        purpose: '',
      });
      setMailBody('');
    }
  }, [template, reset]);

  const onSubmit = (data: TemplateFormData) => {
    onSave({ ...data, mailBody, purpose: data.purpose as EmailPurpose });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="templateName">
              Template Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="templateName"
              {...register('templateName')}
              placeholder="e.g., Welcome Email Template"
            />
            {errors.templateName && (
              <p className="text-sm text-destructive">{errors.templateName.message}</p>
            )}
          </div>

          {/* Email Subject */}
          <div className="space-y-2">
            <Label htmlFor="emailSubject">
              Email Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emailSubject"
              {...register('emailSubject')}
              placeholder="e.g., Welcome to ACADO - {{name}}"
            />
            {errors.emailSubject && (
              <p className="text-sm text-destructive">{errors.emailSubject.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use variables: {'{{name}}'}, {'{{email}}'}, {'{{mobile_number}}'}
            </p>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">
              Purpose <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedPurpose} onValueChange={(val) => setValue('purpose', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                {purposeOptions.map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.purpose && (
              <p className="text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedStatus} onValueChange={(val) => setValue('status', val as 'Active' | 'Inactive')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Explain where this template is used..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Mail Body */}
          <div className="space-y-2">
            <Label>
              Mail Body <span className="text-destructive">*</span>
            </Label>
            <div className="border rounded-lg">
              <ReactQuill
                theme="snow"
                value={mailBody}
                onChange={(content) => {
                  setMailBody(content);
                  setValue('mailBody', content);
                }}
                modules={modules}
                placeholder="Write your email template here..."
              />
            </div>
            {errors.mailBody && (
              <p className="text-sm text-destructive">{errors.mailBody.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Available variables: {'{{name}}'}, {'{{email}}'}, {'{{mobile_number}}'}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
