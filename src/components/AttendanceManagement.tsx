
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceEditModal } from './AttendanceEditModal';
import { AttendanceTable } from './AttendanceTable';
import { AttendanceMassEditModal } from './AttendanceMassEditModal';
import { AttendanceDebugInfo } from './attendance/AttendanceDebugInfo';
import { AttendanceFilters } from './attendance/AttendanceFilters';
import { AttendanceMassActions } from './attendance/AttendanceMassActions';
import { useAttendanceManagement } from '@/hooks/useAttendanceManagement';

const AttendanceManagement = () => {
  const {
    attendanceRecords,
    editingRecord,
    setEditingRecord,
    editReason,
    setEditReason,
    selectedDate,
    setSelectedDate,
    isLoading,
    fetchError,
    selectedIds,
    handleEditAttendance,
    handleMassEditSubmit,
    handleToggleSelect,
    handleSelectAll,
    fetchAttendanceRecords,
  } = useAttendanceManagement();

  const [showDebug, setShowDebug] = useState(false);
  const [massEditOpen, setMassEditOpen] = useState(false);
  const [massEditStatus, setMassEditStatus] = useState<"in" | "out">("in");
  const [massEditReason, setMassEditReason] = useState("");

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const openMassEdit = () => {
    setMassEditOpen(true);
    setMassEditStatus("in");
    setMassEditReason("");
  };

  const closeMassEdit = () => {
    setMassEditOpen(false);
    setMassEditReason("");
  };

  const onMassEditSubmit = async () => {
    await handleMassEditSubmit(massEditStatus, massEditReason);
    setMassEditOpen(false);
    setMassEditReason("");
  };

  return (
    <div className="space-y-6">
      <AttendanceDebugInfo 
        showDebug={showDebug}
        onToggleDebug={() => setShowDebug(v => !v)}
      />

      <AttendanceFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={fetchAttendanceRecords}
        isLoading={isLoading}
        formatDate={formatDate}
      />

      {fetchError && (
        <div className="bg-red-100 text-red-800 rounded px-4 py-2 mb-4">
          Attendance fetch failed: {fetchError}
        </div>
      )}

      <AttendanceMassActions
        selectedCount={selectedIds.size}
        onMassEdit={openMassEdit}
        isLoading={isLoading}
      />

      <AttendanceMassEditModal
        open={massEditOpen}
        onClose={closeMassEdit}
        selectedCount={selectedIds.size}
        status={massEditStatus}
        onStatusChange={(v: "in" | "out") => setMassEditStatus(v)}
        editReason={massEditReason}
        setEditReason={setMassEditReason}
        loading={isLoading}
        onSubmit={onMassEditSubmit}
      />

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
          <CardTitle>
            Attendance Records{selectedDate !== 'all' ? ` - ${formatDate(selectedDate)}` : " (All Dates)"}
          </CardTitle>
          <CardDescription>
            View and edit attendance records. {selectedDate === 'all' ? 'Showing all available records.' : 'Filtered by selected date.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable
            attendanceRecords={attendanceRecords}
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            formatTime={formatTime}
            formatDate={formatDate}
            selectedDate={selectedDate === 'all' ? new Date().toISOString().split('T')[0] : selectedDate}
            selectedIds={Array.from(selectedIds)}
            onSelectAll={handleSelectAll}
            onToggleSelect={handleToggleSelect}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;
