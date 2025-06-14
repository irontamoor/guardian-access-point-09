
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
import type { Database } from '@/integrations/supabase/types';
import { AttendanceEditModal } from './AttendanceEditModal';
import { AttendanceTable } from './AttendanceTable';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];
type UserRole = Database['public']['Enums']['user_role'];

interface AttendanceRecord {
  id: string;
  user_id: string;
  status: AttendanceStatus;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  notes?: string;
  system_users: {
    first_name: string;
    last_name: string;
    id: string;
    role: UserRole;
  };
}

interface AttendanceEdit {
  id: string;
  old_status?: AttendanceStatus;
  new_status: AttendanceStatus;
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
            id,
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
      const newStatus = editingRecord.status as AttendanceStatus;

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
        .insert({
          attendance_record_id: editingRecord.id,
          admin_user_id: user.id,
          old_status: oldStatus,
          new_status: newStatus,
          edit_reason: editReason
        });

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

      {/* Edit Modal */}
      <AttendanceEditModal
        editingRecord={editingRecord}
        editReason={editReason}
        isLoading={isLoading}
        setEditingRecord={setEditingRecord}
        setEditReason={setEditReason}
        handleEditAttendance={handleEditAttendance}
      />

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records - {formatDate(selectedDate)}</CardTitle>
          <CardDescription>View and edit attendance records for the selected date</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable
            attendanceRecords={attendanceRecords}
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            formatTime={formatTime}
            formatDate={formatDate}
            selectedDate={selectedDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
