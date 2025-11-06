import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from '@/types/user';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export const BulkImportDialog: React.FC<BulkImportDialogProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const downloadTemplate = () => {
    const template = [
      ['Name*', 'Email*', 'Username*', 'Password*', 'UserType*', 'Status*', 'MobileNo', 'StudentIdStaffId', 'Address', 'Country', 'State', 'City', 'PinCode', 'DateOfBirth', 'Gender'].join(','),
      ['John Doe', 'john@example.com', 'johndoe', 'password123', 'Learner', 'active', '+1234567890', 'ST001', '123 Main St', 'USA', 'California', 'San Francisco', '94102', '1990-01-01', 'Male'].join(','),
    ].join('\n');
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const parseCSV = (text: string): Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const user: any = {
        status: 'active',
      };
      
      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase().replace('*', '')) {
          case 'name':
            user.name = value;
            break;
          case 'email':
            user.email = value;
            break;
          case 'username':
            user.username = value;
            break;
          case 'password':
            user.password = value;
            break;
          case 'usertype':
            user.userType = value;
            break;
          case 'status':
            user.status = value;
            break;
          case 'mobileno':
            if (value) user.mobileNo = value;
            break;
          case 'studentidstaffid':
            if (value) user.studentIdStaffId = value;
            break;
          case 'address':
            if (value) user.address = value;
            break;
          case 'country':
            if (value) user.country = value;
            break;
          case 'state':
            if (value) user.state = value;
            break;
          case 'city':
            if (value) user.city = value;
            break;
          case 'pincode':
            if (value) user.pinCode = value;
            break;
          case 'dateofbirth':
            if (value) user.dateOfBirth = value;
            break;
          case 'gender':
            if (value) user.gender = value;
            break;
        }
      });
      
      // Validate required fields
      if (user.name && user.email && user.username && user.password && user.userType) {
        users.push(user);
      }
    }
    
    return users;
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      const text = await file.text();
      const users = parseCSV(text);
      
      if (users.length === 0) {
        setError('No valid users found in the file. Please check the format.');
        return;
      }
      
      onImport(users);
      onOpenChange(false);
      setFile(null);
      setError(null);
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple users at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Download the template to see the required format
            </p>
          </div>

          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" asChild>
                <span>Choose CSV File</span>
              </Button>
            </label>
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">CSV Format Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Required fields: Name, Email, Username, Password, UserType, Status</li>
              <li>• UserType must be: Learner, Faculty, or Staff</li>
              <li>• Status must be: active or inactive</li>
              <li>• All other fields are optional</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file}>
              Import Users
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
