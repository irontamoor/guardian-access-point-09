
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare, UserCheck, UserX } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface TableProps {
  attendanceRecords: any[];
  editingRecord: any;
  setEditingRecord: (rec: any) => void;
  formatTime: (timestamp?: string) => string;
  formatDate: (timestamp: string) => string;
  selectedDate: string;
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onToggleSelect?: (id: string, checked: boolean) => void;
}

export const AttendanceTable: React.FC<TableProps> = ({
  attendanceRecords,
  editingRecord,
  setEditingRecord,
  formatTime,
  formatDate,
  selectedDate,
  selectedIds = [],
  onSelectAll,
  onToggleSelect,
}) => {
  const allSelected = attendanceRecords.length > 0 && attendanceRecords.every((r) => selectedIds.includes(r.id));
  const partialSelected = selectedIds.length > 0 && !allSelected;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected}
              // Removed invalid "indeterminate" prop which caused TS error
              aria-label="Select all"
              onCheckedChange={checked => onSelectAll && onSelectAll(Boolean(checked))}
            />
          </TableHead>
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
        {attendanceRecords.map((record) => {
          // Fallback for missing user data
          const user = record.system_users || {};
          const name = (user.first_name && user.last_name)
            ? `${user.first_name} ${user.last_name}`
            : "(unknown user)";
          const userId = user.id || record.user_id || '-';
          const role = user.role || 'unknown';

          return (
            <TableRow key={record.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(record.id)}
                  aria-label="Select row"
                  onCheckedChange={checked => onToggleSelect && onToggleSelect(record.id, Boolean(checked))}
                />
              </TableCell>
              <TableCell className="font-medium">
                {name}
              </TableCell>
              <TableCell>
                {userId}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  role === 'admin' ? 'bg-red-100 text-red-800' :
                  role === 'staff' ? 'bg-green-100 text-green-800' :
                  role === 'student' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {role}
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
          );
        })}
        {attendanceRecords.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-gray-500 py-8">
              No attendance records found for {formatDate(selectedDate)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
