import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useEnumValues } from "@/hooks/useEnumValues";

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type UserStatus = Database['public']['Enums']['user_status'];

const UserManagement = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const { values: allRoles, loading: loadingRoles } = useEnumValues("app_role");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    employee_id: "",
    student_id: "",
    role: "student" as UserRole,
    status: "active" as UserStatus,
    password: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('system_users')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || null,
            role: formData.role,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingUser.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User updated successfully",
          variant: "default"
        });
      } else {
        // Create new user
        const { data: newUser, error: userError } = await supabase
          .from('system_users')
          .insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone || null,
            role: formData.role,
            status: formData.status
          })
          .select()
          .single();

        if (userError) throw userError;

        // If password is provided, create auth user with plain password
        if (formData.password) {
          const { error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                first_name: formData.first_name,
                last_name: formData.last_name
              }
            }
          });

          if (authError) {
            // If auth creation fails, clean up the system user
            await supabase.from('system_users').delete().eq('id', newUser.id);
            throw authError;
          }
        }

        // Create role assignment
        if (newUser) {
          const { error: roleError } = await supabase
            .from('user_role_assignments')
            .insert({
              user_id: newUser.id,
              role: formData.role
            });

          if (roleError) throw roleError;
        }

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
      employee_id: "",
      student_id: "",
      role: "student",
      status: "active",
      password: ""
    });
    setEditingUser(null);
  };

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email || '',
      phone: user.phone || '',
      employee_id: user.employee_id || '',
      student_id: user.student_id || '',
      role: user.role,
      status: user.status,
      password: ""
    });
    setIsOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
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
                  employee_id: "",
                  student_id: "",
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

              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave blank for users without auth access"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={formData.employee_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input
                    id="student_id"
                    value={formData.student_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                  />
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
                      {allRoles.map((role) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>System Users</span>
          </CardTitle>
          <CardDescription>
            Manage all users in the system
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
                  <TableHead>ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell className="capitalize">{user.status}</TableCell>
                    <TableCell>{user.employee_id || user.student_id}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
