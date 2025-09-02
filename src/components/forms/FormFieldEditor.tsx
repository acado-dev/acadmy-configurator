import React from 'react';
import { GripVertical, PenTool, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ConfiguredField } from '@/types/application';

interface FormFieldEditorProps {
  field: ConfiguredField;
  editingField: ConfiguredField | null;
  onUpdate: (fieldId: string, updates: Partial<ConfiguredField>) => void;
  onRemove: (fieldId: string) => void;
  onEdit: (field: ConfiguredField | null) => void;
}

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  field,
  editingField,
  onUpdate,
  onRemove,
  onEdit,
}) => {
  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-move" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {editingField?.id === field.id ? (
              <Input
                value={field.customLabel || field.label}
                onChange={(e) => onUpdate(field.id, { customLabel: e.target.value })}
                className="h-7 text-sm font-medium"
              />
            ) : (
              <p className="font-medium">{field.customLabel || field.label}</p>
            )}
            <Badge variant="secondary" className="text-xs">
              {field.type}
            </Badge>
            {field.isRequired && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Field name: {field.name}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id={`visible-${field.id}`}
                checked={field.isVisible}
                onCheckedChange={(checked) => onUpdate(field.id, { isVisible: checked })}
              />
              <Label htmlFor={`visible-${field.id}`} className="text-sm">
                Visible
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={`required-${field.id}`}
                checked={field.isRequired}
                onCheckedChange={(checked) => onUpdate(field.id, { isRequired: checked })}
              />
              <Label htmlFor={`required-${field.id}`} className="text-sm">
                Required
              </Label>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {editingField?.id === field.id ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(null)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  onUpdate(field.id, { customLabel: field.label });
                  onEdit(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(field)}
              >
                <PenTool className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemove(field.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};