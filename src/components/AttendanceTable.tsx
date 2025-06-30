
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

  const getName = (record: any) => {
    if (record.system_users) {
      return `${record.system_users.first_name} ${record.system_users.last_name}`;
    }
    if (record.visitors) {
      return `${record.visitors.first_name} ${record.visitors.last_name}`;
    }
    return `User ID: ${record.user_id}`;
  };

  const getUserId = (record: any) => {
    if (record.system_users) {
      return record.system_users.user_code || record.system_users.id;
    }
    if (record.visitors) {
      return record.visitors.id;
    }
    return record.user_id || '-';
  };

  const getRole = (record: any) => {
    if (record.system_users) {
      return record.system_users.role;
    }
    if (record.visitors) {
      return 'visitor';
    }
    return 'unknown';
  };

  const getOrganization = (record: any) => {
    if (record.visitors?.organization) {
      return record.visitors.organization;
    }
    return '-';
  };

  return (
    <div className="space-y-4">
      {attendanceRecords.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No attendance records found</p>
          <p className="text-gray-400 text-sm mt-2">
            {selectedDate === 'all' ? 
              'No one has signed in or out yet' : 
              `No attendance records for ${formatDate(selectedDate)}`
            }
          </p>
        </div>
      )}
      
      {attendanceRecords.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  aria-label="Select all"
                  onCheckedChange={checked => onSelectAll && onSelectAll(Boolean(checked))}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID/Code</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => {
              const name = getName(record);
              const userId = getUserId(record);
              const role = getRole(record);
              const organization = getOrganization(record);

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
                      role === 'visitor' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {organization}
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
          </TableBody>
        </Table>
      )}
    </div>
  );
};
