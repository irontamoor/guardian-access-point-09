
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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

export function useAttendanceManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editReason, setEditReason] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchSystemUsers = useCallback(async () => {
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
  }, []);

  const fetchAttendanceRecords = useCallback(async () => {
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

      const merged = (data || []).map((record: any) => {
        const sysUser = systemUsers.find(u => u.id === record.user_id);
        return {
          ...record,
          system_users: sysUser || null,
        };
      });

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
  }, [selectedDate, systemUsers, toast]);

  const handleEditAttendance = useCallback(async () => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const oldStatus = attendanceRecords.find(r => r.id === editingRecord.id)?.status;
      const newStatus = editingRecord.status as AttendanceStatus;

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
  }, [editingRecord, editReason, attendanceRecords, toast, fetchAttendanceRecords]);

  const handleMassEditSubmit = useCallback(async (massEditStatus: "in" | "out", massEditReason: string) => {
    if (selectedIds.length === 0 || !massEditReason.trim()) return;
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('attendance_records')
        .update({
          status: massEditStatus,
          check_in_time: massEditStatus === 'in' ? new Date().toISOString() : undefined,
          check_out_time: massEditStatus === 'out' ? new Date().toISOString() : null,
        })
        .in('id', selectedIds);

      if (updateError) throw updateError;

      for (const id of selectedIds) {
        const oldStatus = attendanceRecords.find(r => r.id === id)?.status;
        await supabase.from('attendance_edits').insert({
          attendance_record_id: id,
          admin_user_id: user.id,
          old_status: oldStatus,
          new_status: massEditStatus,
          edit_reason: massEditReason,
        });
      }

      toast({
        title: "Success",
        description: `Updated status for ${selectedIds.length} attendance record(s).`,
      });

      setSelectedIds([]);
      fetchAttendanceRecords();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Mass edit failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedIds, attendanceRecords, toast, fetchAttendanceRecords]);

  const handleToggleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => 
      checked ? [...prev, id] : prev.filter(selId => selId !== id)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedIds(checked ? attendanceRecords.map(r => r.id) : []);
  }, [attendanceRecords]);

  useEffect(() => {
    fetchSystemUsers();
  }, [fetchSystemUsers]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  return {
    attendanceRecords,
    editingRecord,
    setEditingRecord,
    editReason,
    setEditReason,
    selectedDate,
    setSelectedDate,
    isLoading,
    fetchError,
    debugMessage,
    selectedIds,
    handleEditAttendance,
    handleMassEditSubmit,
    handleToggleSelect,
    handleSelectAll,
    fetchAttendanceRecords,
  };
}
