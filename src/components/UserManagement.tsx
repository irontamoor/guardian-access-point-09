
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit, Trash2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useEnumValues } from "@/hooks/useEnumValues";
import { useVMSData } from "@/hooks/useVMSData";
import { Switch } from "@/components/ui/switch";
import { UserPasswordResetModal } from './UserPasswordResetModal';

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type UserStatus = Database['public']['Enums']['user_status'];

const UserManagement = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<SystemUser | null>(null);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const { values: allRoles, loading: loadingRoles } = useEnumValues("app_role");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    user_code: "",
    role: "student" as UserRole,
    status: "active" as UserStatus,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { updateStudentStatus, updateStaffStatus } = useVMSData();
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<Record<string, "present" | "absent">>({});
  const [attendanceLoading, setAttendanceLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("all");

  useEffect(() => {
    loadUsers();
    loadAttendanceStatus();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load users: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Load current attendance status from today's records
  const loadAttendanceStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('user_id, status')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lte('created_at', `${today}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get the latest status for each user today
      const statusMap: Record<string, "present" | "absent"> = {};
      data?.forEach((record: any) => {
        if (!statusMap[record.user_id]) {
          statusMap[record.user_id] = record.status === "in" ? "present" : "absent";
        }
      });
      
      setAttendanceStatusMap(statusMap);
    } catch (error: any) {
      console.error('Error loading attendance status:', error);
      setAttendanceStatusMap({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.user_code) {
        toast({
          title: "Error",
          description: "User Code (ID) is required",
          variant: "destructive"
        });
        return;
      }

      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        user_code: formData.user_code,
        role: formData.role,
        status: formData.status,
        password: formData.password || null,
        updated_at: new Date().toISOString()
      };

      if (editingUser) {
        const { error } = await supabase
          .from('system_users')
          .update(userData)
          .eq('id', editingUser.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User updated successfully",
          variant: "default"
        });
      } else {
        const { error } = await supabase
          .from('system_users')
          .insert({
            ...userData,
            updated_at: undefined // Remove updated_at for insert
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "User created successfully",
          variant: "default"
        });
      }

      setIsOpen(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save user: " + error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      user_code: "",
      role: "student",
      status: "active",
      password: ""
    });
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email || '',
      phone: user.phone || '',
      user_code: user.user_code || '',
      role: user.role,
      status: user.status,
      password: ""
    });
    setIsOpen(true);
  };

  const handlePasswordReset = (user: SystemUser) => {
    setPasswordResetUser(user);
    setIsPasswordResetOpen(true);
  };

  const handleDelete = async (user: SystemUser) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('system_users')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default"
      });
      
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive"
      });
    }
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((u) => u.role === selectedRole);

  const handleStatusToggle = async (user: SystemUser, checked: boolean) => {
    setAttendanceLoading(user.id);
    try {
      const newStatus = checked ? "present" : "absent";
      
      if (user.role === "student") {
        await updateStudentStatus(user.id, newStatus);
      } else if (user.role === "staff") {
        await updateStaffStatus(user.id, newStatus);
      }
      
      // Update local state immediately
      setAttendanceStatusMap((prev) => ({ 
        ...prev, 
        [user.id]: newStatus 
      }));
      
      toast({ 
        title: "Attendance updated", 
        description: `${user.first_name} ${user.last_name} is now marked as ${newStatus}` 
      });
    } catch (e: any) {
      toast({ 
        title: "Error", 
        description: "Failed to update attendance: " + e.message, 
        variant: "destructive" 
      });
    } finally {
      setAttendanceLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <Label htmlFor="filter-role" className="mb-1 block">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={loadingRoles}
            >
              <SelectTrigger className="min-w-[140px]" id="filter-role">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Forms</SelectItem>
                {allRoles
                  .filter(role => role !== "moderator" && role !== "user")
                  .map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingUser(null);
                  setIsOpen(true);
                  setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                    user_code: "",
                    role: allRoles[0] as UserRole || "student",
                    status: "active",
                    password: "",
                  });
                }}
                disabled={loadingRoles}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information' : 'Create a new system user'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_code">
                    User Code (Staff/Student/Visitor Code)<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="user_code"
                    value={formData.user_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, user_code: e.target.value }))}
                    placeholder="Enter unique staff/student/visitor code"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Leave empty for no password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: UserRole) => setFormData((prev) => ({ ...prev, role: value }))}
                      disabled={loadingRoles}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingRoles && <div className="px-4 py-2">Loading...</div>}
                        {allRoles
                          .filter(role => role !== "moderator" && role !== "user")
                          .map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: UserStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUser ? 'Update User' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>System Users</span>
          </CardTitle>
          <CardDescription>
            {selectedRole === "all"
              ? "Manage all users in the system"
              : `Viewing "${selectedRole}" users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User Code</TableHead>
                  <TableHead>Database UUID</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell className="capitalize">{user.status}</TableCell>
                    <TableCell>{user.user_code}</TableCell>
                    <TableCell className="break-all">{user.id}</TableCell>
                    <TableCell>
                      <Switch
                        checked={attendanceStatusMap[user.id] === "present"}
                        onCheckedChange={(checked) => handleStatusToggle(user, checked)}
                        disabled={attendanceLoading === user.id}
                        aria-label="Present/Absent switch"
                      />
                      <span className="text-xs ml-2">
                        {attendanceStatusMap[user.id] === "present" ? "Present" : "Absent"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePasswordReset(user)}
                          title="Reset Password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user)}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="text-center text-gray-400 py-4">
                        No users found for this role.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserPasswordResetModal
        user={passwordResetUser}
        isOpen={isPasswordResetOpen}
        onClose={() => setIsPasswordResetOpen(false)}
        onSuccess={() => {
          loadUsers();
          setPasswordResetUser(null);
        }}
      />
    </div>
  );
};

export default UserManagement;
