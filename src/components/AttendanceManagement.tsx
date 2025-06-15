import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Edit, MessageSquare, UserCheck, UserX, RefreshCcw } from 'lucide-react';
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

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editReason, setEditReason] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemUsers();
  }, []);

  useEffect(() => {
    fetchAttendanceRecords();
    // eslint-disable-next-line
  }, [selectedDate, systemUsers]);

  // Fetch all users ONCE so we can join in frontend
  const fetchSystemUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('system_users')
        .select('*');
      if (error) throw error;
      setSystemUsers(data || []);
    } catch (error: any) {
      setSystemUsers([]);
      setDebugMessage((prev: string | null) =>
        (prev || "") + `\nFailed to load users: ${error.message}`
      );
    }
  };

  const fetchAttendanceRecords = async () => {
    setIsLoading(true);
    setFetchError(null);
    setDebugMessage(null);
    try {
      let query = supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedDate !== 'all') {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Merge in user info from separately-fetched systemUsers
      const merged = (data || []).map((record: any) => {
        const sysUser = systemUsers.find(u => u.id === record.user_id);
        return {
          ...record,
          system_users: sysUser || null,
        };
      });

      // Debug info for validation
      console.log('[AttendanceManagement] Attendance:', merged);
      setDebugMessage(
        `Fetched ${merged.length} attendance. Raw data: ${JSON.stringify(merged, null, 2)}`
      );

      setAttendanceRecords(merged);
    } catch (error: any) {
      setAttendanceRecords([]);
      setFetchError(error.message || "Failed to fetch attendance records.");
      setDebugMessage(error.stack || 'No stack');
      toast({
        title: "Error",
        description: error.message || "Failed to fetch attendance records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Label htmlFor="date">Select Date:</Label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-40" id="date">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value={new Date().toISOString().split('T')[0]}>
                Today ({new Date().toLocaleDateString()})
              </SelectItem>
              {/* Optionally add more recent days here */}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            onClick={fetchAttendanceRecords}
            disabled={isLoading}
            className="ml-2 flex gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-100 text-red-800 rounded px-4 py-2 mb-4">
          Attendance fetch failed: {fetchError}
        </div>
      )}

      {/* Debug Information */}
      {debugMessage && (
        <div className="bg-gray-100 text-gray-800 rounded px-3 py-2 text-xs mb-2">
          <b>Debug info:</b>
          <pre className="overflow-auto">{debugMessage}</pre>
        </div>
      )}

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
          <CardTitle>Attendance Records{selectedDate !== 'all' ? ` - ${formatDate(selectedDate)}` : " (All Dates)"}</CardTitle>
          <CardDescription>View and edit attendance records. {selectedDate === 'all' ? 'Showing all available records.' : 'Filtered by selected date.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable
            attendanceRecords={attendanceRecords}
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            formatTime={formatTime}
            formatDate={formatDate}
            selectedDate={selectedDate === 'all' ? new Date().toISOString().split('T')[0] : selectedDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
