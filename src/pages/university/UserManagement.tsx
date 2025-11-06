import React, { useState, useEffect } from 'react';
import { Plus, Search, Upload, Download, MoreHorizontal, Mail, KeyRound, Trash2, Edit, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, UserType, UserStatus } from '@/types/user';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { BulkImportDialog } from '@/components/users/BulkImportDialog';
import { useToast } from '@/hooks/use-toast';
import { initializeUniversityUsers } from '@/data/sampleUsers';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeUniversityUsers('Stanford University');
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('universityUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  };

  const saveUsers = (updatedUsers: User[]) => {
    localStorage.setItem('universityUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleAddUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    toast({
      title: 'User added',
      description: `${newUser.name} has been added successfully.`,
    });
  };

  const handleEditUser = (user: User) => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...user, updatedAt: new Date().toISOString() } : u
    );
    saveUsers(updatedUsers);
    setEditingUser(null);
    toast({
      title: 'User updated',
      description: `${user.name} has been updated successfully.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    saveUsers(users.filter(u => u.id !== userId));
    toast({
      title: 'User deleted',
      description: `${user?.name} has been deleted.`,
      variant: 'destructive',
    });
  };

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' as UserStatus : 'active' as UserStatus, updatedAt: new Date().toISOString() }
        : u
    );
    saveUsers(updatedUsers);
    const user = updatedUsers.find(u => u.id === userId);
    toast({
      title: user?.status === 'active' ? 'User activated' : 'User deactivated',
      description: `${user?.name} is now ${user?.status}.`,
    });
  };

  const handleResetPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: 'Password reset',
      description: `Password reset link sent to ${user?.email}`,
    });
  };

  const handleSendCredentials = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: 'Credentials sent',
      description: `Login credentials sent to ${user?.email}`,
    });
  };

  const handleBulkImport = (importedUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const newUsers: User[] = importedUsers.map(user => ({
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    saveUsers([...users, ...newUsers]);
    toast({
      title: 'Bulk import successful',
      description: `${newUsers.length} users imported successfully.`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || user.userType === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Username', 'User Type', 'Status', 'Mobile No', 'Student/Staff ID', 'Date of Birth', 'Gender'].join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.email,
        u.username,
        u.userType,
        u.status,
        u.mobileNo || '',
        u.studentIdStaffId || '',
        u.dateOfBirth || '',
        u.gender || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({
      title: 'Export successful',
      description: 'Users exported to CSV file.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage learners, faculty, and staff</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as UserType | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Learner">Learner</SelectItem>
            <SelectItem value="Faculty">Faculty</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
        <Button variant="outline" onClick={() => setIsBulkImportOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
        <Button variant="outline" onClick={exportUsers}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Student/Staff ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found. Add your first user to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.userType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.studentIdStaffId || '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingUser(user); setIsAddDialogOpen(true); }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                          {user.status === 'active' ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                          <KeyRound className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendCredentials(user.id)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Credentials
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        editUser={editingUser}
      />

      <BulkImportDialog
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImport={handleBulkImport}
      />
    </div>
  );
};

export default UserManagement;
