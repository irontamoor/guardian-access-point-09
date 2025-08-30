import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStudentAttendanceData, StudentAttendanceRecord } from '@/hooks/attendance/useStudentAttendanceData';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceSearch } from '../AttendanceSearch';
import { StudentAttendanceEditModal } from './StudentAttendanceEditModal';
import { useToast } from '@/hooks/use-toast';

interface StudentAttendanceTableProps {
  userRole: string;
}

export function StudentAttendanceTable({ userRole }: StudentAttendanceTableProps) {
  const { records, isLoading, error, fetchRecords, updateRecord, deleteRecord } = useStudentAttendanceData();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filteredRecords, setFilteredRecords] = useState<StudentAttendanceRecord[]>(records);
  const [editingRecord, setEditingRecord] = useState<StudentAttendanceRecord | null>(null);
  const { toast } = useToast();

  // Sync filtered records when records change
  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleToggleSelect = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredRecords.map(record => record.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSearch = (filters: any) => {
    let filtered = records;
    
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(record => 
        record.student_name.toLowerCase().includes(query) ||
        record.student_id.toLowerCase().includes(query) ||
        (record.notes && record.notes.toLowerCase().includes(query))
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    setFilteredRecords(filtered);
  };

  const handleClearSearch = () => {
    setFilteredRecords(records);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      toast({
        title: "Success",
        description: "Student attendance record deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    fetchRecords(selectedDate);
  };

  const handleEdit = async (id: string, updates: Partial<StudentAttendanceRecord>) => {
    await updateRecord(id, updates);
    refreshData();
  };

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive rounded px-4 py-2 mb-4">
        Error loading student attendance: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AttendanceFilters
        selectedDate={selectedDate}
        onDateChange={(date) => {
          setSelectedDate(date);
          fetchRecords(date);
        }}
        onRefresh={refreshData}
        isLoading={isLoading}
        formatDate={formatDate}
      />

      <AttendanceSearch 
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {userRole !== 'reader' && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === filteredRecords.length && filteredRecords.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>Student ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Check-out Time</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              {userRole !== 'reader' && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={userRole === 'reader' ? 7 : 9} className="text-center py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading student attendance records...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === 'reader' ? 7 : 9} className="text-center py-8 text-muted-foreground">
                  No student attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  {userRole !== 'reader' && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={() => handleToggleSelect(record.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{record.student_id}</TableCell>
                  <TableCell>{record.student_name}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'in' ? 'default' : 'secondary'}>
                      {record.status === 'in' ? 'Signed In' : 'Signed Out'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTime(record.check_in_time)}</TableCell>
                  <TableCell>{formatTime(record.check_out_time)}</TableCell>
                  <TableCell>{record.notes || '-'}</TableCell>
                  <TableCell>{formatDate(record.created_at)}</TableCell>
                  {userRole !== 'reader' && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingRecord(record)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <StudentAttendanceEditModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleEdit}
      />
    </div>
  );
}