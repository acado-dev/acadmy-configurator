import React, { useState } from 'react';
import { Rocket, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface FormLaunchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formName: string;
  startDate?: Date;
  endDate?: Date;
  onLaunch: (startDate?: Date, endDate?: Date) => void;
}

export const FormLaunchDialog: React.FC<FormLaunchDialogProps> = ({
  isOpen,
  onClose,
  formName,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onLaunch,
}) => {
  const [startDate, setStartDate] = useState(
    initialStartDate ? format(initialStartDate, "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? format(initialEndDate, "yyyy-MM-dd'T'HH:mm") : ''
  );

  const handleLaunch = () => {
    onLaunch(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Launch Application Form</DialogTitle>
          <DialogDescription>
            Set the availability period for "{formName}". Leave empty for no restrictions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">
              <Calendar className="w-4 h-4 inline mr-2" />
              Start Date & Time (Optional)
            </Label>
            <Input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Select start date and time"
            />
            <p className="text-xs text-muted-foreground">
              Form will be available from this date
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">
              <Clock className="w-4 h-4 inline mr-2" />
              End Date & Time (Optional)
            </Label>
            <Input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              placeholder="Select end date and time"
            />
            <p className="text-xs text-muted-foreground">
              Form will be closed after this date
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLaunch} className="gap-2">
            <Rocket className="w-4 h-4" />
            Launch Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};