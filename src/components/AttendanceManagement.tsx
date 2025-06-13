
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Edit, MessageSquare, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AttendanceRecord {
  id: string;
  user_id: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  notes?: string;
  system_users: {
    first_name: string;
    last_name: string;
    employee_id?: string;
    student_id?: string;
    role: string;
  };
}

interface AttendanceEdit {
  id: string;
  old_status?: string;
  new_status: string;
  edit_reason: string;
  edited_at: string;
}

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editReason, setEditReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchAttendanceRecords = async () => {
    try {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 1);

      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          system_users (
            first_name,
            last_name,
            employee_id,
            student_id,
            role
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch attendance records",
        variant: "destructive"
      });
    }
  };

  const handleEditAttendance = async () => {
    if (!editingRecord || !editReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the edit",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user for audit trail
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const oldStatus = attendanceRecords.find(r => r.id === editingRecord.id)?.status;
      const newStatus = editingRecord.status;

      // Update attendance record
      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({
          status: newStatus,
          check_in_time: editingRecord.status === 'in' ? (editingRecord.check_in_time || new Date().toISOString()) : editingRecord.check_in_time,
          check_out_time: editingRecord.status === 'out' ? (editingRecord.check_out_time || new Date().toISOString()) : null,
          notes: editingRecord.notes
        })
        .eq('id', editingRecord.id);

      if (updateError) throw updateError;

      // Log the edit
      const { error: logError } = await supabase
        .from('attendance_edits')
        .insert([{
          attendance_record_id: editingRecord.id,
          admin_user_id: user.id,
          old_status: oldStatus,
          new_status: newStatus,
          edit_reason: editReason
        }]);

      if (logError) throw logError;

      toast({
        title: "Success",
        description: "Attendance record updated successfully",
        variant: "default"
      });

      setEditingRecord(null);
      setEditReason('');
      fetchAttendanceRecords();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update attendance record",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="date">Select Date:</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {editingRecord && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle>Edit Attendance Record</CardTitle>
            <CardDescription>
              Editing attendance for {editingRecord.system_users.first_name} {editingRecord.system_users.last_name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingRecord.status}
                  onValueChange={(value) => setEditingRecord(prev => prev ? ({ ...prev, status: value }) : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">In</SelectItem>
                    <SelectItem value="out">Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={editingRecord.notes || ''}
                  onChange={(e) => setEditingRecord(prev => prev ? ({ ...prev, notes: e.target.value }) : null)}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editReason">Reason for Edit (Required)</Label>
              <Textarea
                id="editReason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Please provide a reason for this attendance edit..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleEditAttendance} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                <UserCheck className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {formatDate(selectedDate)}</CardTitle>
          <CardDescription>View and edit attendance records for the selected date</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.system_users.first_name} {record.system_users.last_name}
                  </TableCell>
                  <TableCell>
                    {record.system_users.employee_id || record.system_users.student_id || '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.system_users.role === 'admin' ? 'bg-red-100 text-red-800' :
                      record.system_users.role === 'staff' ? 'bg-green-100 text-green-800' :
                      record.system_users.role === 'student' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.system_users.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                      record.status === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'in' ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                      <span>{record.status === 'in' ? 'In' : 'Out'}</span>
                    </span>
                  </TableCell>
                  <TableCell>{formatTime(record.check_in_time)}</TableCell>
                  <TableCell>{formatTime(record.check_out_time)}</TableCell>
                  <TableCell>
                    {record.notes ? (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span className="truncate max-w-20" title={record.notes}>
                          {record.notes}
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingRecord(record)}
                      disabled={editingRecord?.id === record.id}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {attendanceRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No attendance records found for {formatDate(selectedDate)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
