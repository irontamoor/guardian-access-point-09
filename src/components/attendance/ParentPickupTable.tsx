import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useParentPickupData, ParentPickupRecord } from '@/hooks/attendance/useParentPickupData';
import { AttendanceFilters } from './AttendanceFilters';
import { AttendanceSearch } from '../AttendanceSearch';
import { ParentPickupEditModal } from './ParentPickupEditModal';
import { useToast } from '@/hooks/use-toast';

interface ParentPickupTableProps {
  userRole: string;
}

export function ParentPickupTable({ userRole }: ParentPickupTableProps) {
  const { records, isLoading, error, fetchRecords, updateRecord, deleteRecord } = useParentPickupData();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filteredRecords, setFilteredRecords] = useState<ParentPickupRecord[]>(records);
  const [editingRecord, setEditingRecord] = useState<ParentPickupRecord | null>(null);
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
        record.student_id.toLowerCase().includes(query) ||
        (record.student_name && record.student_name.toLowerCase().includes(query)) ||
        record.parent_guardian_name.toLowerCase().includes(query) ||
        record.relationship.toLowerCase().includes(query) ||
        (record.pickup_type && record.pickup_type.toLowerCase().includes(query)) ||
        (record.notes && record.notes.toLowerCase().includes(query))
      );
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
        description: "Parent pickup record deleted successfully",
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

  const handleEdit = async (id: string, updates: Partial<ParentPickupRecord>) => {
    await updateRecord(id, updates);
    // Refresh data after successful update
    refreshData();
  };

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive rounded px-4 py-2 mb-4">
        Error loading parent pickup records: {error}
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
              <TableHead>Parent/Guardian Name</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Pickup Type</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Action Time</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
              {userRole !== 'reader' && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={userRole === 'reader' ? 9 : 11} className="text-center py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading parent pickup records...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === 'reader' ? 9 : 11} className="text-center py-8 text-muted-foreground">
                  No parent pickup records found
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
                  <TableCell>{record.student_name || '-'}</TableCell>
                  <TableCell>{record.parent_guardian_name}</TableCell>
                  <TableCell>{record.relationship}</TableCell>
                  <TableCell>{record.pickup_type || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={record.action_type === 'pickup' ? 'default' : 'secondary'}>
                      {record.action_type === 'pickup' ? 'Pickup' : 'Drop-off'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatTime(record.action_time)}</TableCell>
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

      <ParentPickupEditModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleEdit}
      />
    </div>
  );
}