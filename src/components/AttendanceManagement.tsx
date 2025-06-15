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

  // Debug info state (like AttendanceRecordsTable)
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Debug info fetch effect (run once on mount)
  useEffect(() => {
    async function debugUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      let sysUser = null;
      let roleRow = null;
      if (user) {
        // Find corresponding system_user
        const { data: sysUserData } = await supabase
          .from("system_users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        sysUser = sysUserData;

        // Find admin role assignment
        const { data: roleRowData } = await supabase
          .from("user_role_assignments")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "admin");
        roleRow = roleRowData;
      }
      setDebugInfo({
        supabaseUser: user,
        supabaseUserError: error,
        systemUser: sysUser,
        adminRoleAssignments: roleRow,
      });
      // Optional: console logs for debugging
      console.log("[AttendanceManagement] Supabase User:", user, error);
      console.log("[AttendanceManagement] system_users row:", sysUser);
      console.log("[AttendanceManagement] admin role assignments:", roleRow);
    }
    debugUser();
  }, []);

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
      {/* Debug Info Toggle/Button */}
      <div className="mb-2">
        <button
          className="text-xs text-gray-500 underline mb-1"
          onClick={() => setShowDebug((v) => !v)}
          type="button"
        >
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </button>
        {showDebug && (
          <div className="bg-gray-100 border rounded p-3 mb-2 text-xs max-w-full overflow-x-auto">
            <div>
              <strong>Supabase User:</strong>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUser, null, 2)}</pre>
            </div>
            <div>
              <strong>Supabase User Error:</strong>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUserError, null, 2)}</pre>
            </div>
            <div>
              <strong>System User (system_users row):</strong>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.systemUser, null, 2)}</pre>
            </div>
            <div>
              <strong>Admin Role Assignments:</strong>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.adminRoleAssignments, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

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
