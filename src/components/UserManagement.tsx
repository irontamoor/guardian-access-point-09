
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type UserStatus = Database['public']['Enums']['user_status'];

interface SystemUser {
  id: string;
  employee_id?: string;
  student_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_id: '',
    student_id: '',
    role: 'student' as UserRole,
    status: 'active' as UserStatus
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
        description: error.message || "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: userData, error } = await supabase
        .from('system_users')
        .insert(newUser)
        .select('id')
        .single();

      if (error) throw error;

      // Create role assignment
      if (userData) {
        await supabase
          .from('user_role_assignments')
          .insert({
            user_id: userData.id,
            role: newUser.role
          });
      }

      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default"
      });

      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        employee_id: '',
        student_id: '',
        role: 'student' as UserRole,
        status: 'active' as UserStatus
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('system_users')
        .update({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          email: editingUser.email,
          phone: editingUser.phone,
          employee_id: editingUser.employee_id,
          student_id: editingUser.student_id,
          role: editingUser.role,
          status: editingUser.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default"
      });

      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const { error } = await supabase
        .from('system_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default"
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={newUser.employee_id}
                    onChange={(e) => setNewUser(prev => ({ ...prev, employee_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input
                    id="student_id"
                    value={newUser.student_id}
                    onChange={(e) => setNewUser(prev => ({ ...prev, student_id: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newUser.status} onValueChange={(value: UserStatus) => setNewUser(prev => ({ ...prev, status: value }))}>
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
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  Create User
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {editingUser?.id === user.id ? (
                      <div className="flex space-x-2">
                        <Input
                          value={editingUser.first_name}
                          onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, first_name: e.target.value }) : null)}
                          className="w-20"
                        />
                        <Input
                          value={editingUser.last_name}
                          onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, last_name: e.target.value }) : null)}
                          className="w-20"
                        />
                      </div>
                    ) : (
                      `${user.first_name} ${user.last_name}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.email || ''}
                        onChange={(e) => setEditingUser(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                      />
                    ) : (
                      user.email || '-'
                    )}
                  </TableCell>
                  <TableCell>{user.employee_id || user.student_id || '-'}</TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Select value={editingUser.role} onValueChange={(value: UserRole) => setEditingUser(prev => prev ? ({ ...prev, role: value }) : null)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'staff' ? 'bg-green-100 text-green-800' :
                        user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Select value={editingUser.status} onValueChange={(value: UserStatus) => setEditingUser(prev => prev ? ({ ...prev, status: value }) : null)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingUser?.id === user.id ? (
                        <>
                          <Button size="sm" onClick={handleEditUser} disabled={isLoading}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
