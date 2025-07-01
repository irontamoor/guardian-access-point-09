
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare, UserCheck, UserX, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';

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
  userRole?: string;
  onRefresh?: () => void;
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
  userRole = 'admin',
  onRefresh
}) => {
  const [completingRecords, setCompletingRecords] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  const allSelected = attendanceRecords.length > 0 && attendanceRecords.every((r) => selectedIds.includes(r.id));

  const getName = (record: any) => {
    // Special handling for Parent Pickup/Dropoff records
    if (isPickupRecord(record)) {
      const studentName = record.first_name && record.last_name 
        ? `${record.first_name} ${record.last_name}` 
        : 'Unknown Student';
      const parentName = record.host_name || 'Unknown Parent';
      return `${studentName} (Parent: ${parentName})`;
    }

    // Use merged data first (from new structure)
    if (record.first_name && record.last_name) {
      return `${record.first_name} ${record.last_name}`;
    }
    // Fall back to system user data
    if (record.system_users) {
      return `${record.system_users.first_name} ${record.system_users.last_name}`;
    }
    return `Unknown User (${record.user_id})`;
  };

  const getUserId = (record: any) => {
    if (record.system_users) {
      return record.system_users.user_code || record.system_users.admin_id || record.system_users.id.substring(0, 8);
    }
    // For visitors, use phone number or truncated ID
    if (record.phone_number) {
      return record.phone_number;
    }
    return record.user_id?.substring(0, 8) || 'N/A';
  };

  const getRole = (record: any) => {
    // Special handling for Parent Pickup/Dropoff records
    if (isPickupRecord(record)) {
      return 'pickup/dropoff';
    }
    
    if (record.system_users) {
      return record.system_users.role;
    }
    // If has visitor data, it's a visitor
    if (record.organization || record.visit_purpose || record.phone_number) {
      return 'visitor';
    }
    return 'unknown';
  };

  const getOrganization = (record: any) => {
    return record.organization || record.company || '-';
  };

  const getPurpose = (record: any) => {
    return record.visit_purpose || record.purpose || '-';
  };

  const isPickupRecord = (record: any) => {
    return record.organization === 'Parent Pickup/Dropoff' || 
           (record.visit_purpose && record.visit_purpose.includes('pickup'));
  };

  const handleCompletePickup = async (record: any) => {
    setCompletingRecords(prev => new Set(prev).add(record.id));
    
    try {
      const { error } = await supabase
        .from('attendance_records')
        .update({
          notes: (record.notes || '') + ' [COMPLETED]',
          status: 'in'
        })
        .eq('id', record.id);

      if (error) throw error;

      toast({
        title: "Pickup Completed",
        description: `Pickup for ${getName(record)} has been marked as completed`,
        variant: "default"
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error: any) {
      console.error('Error completing pickup:', error);
      toast({
        title: "Error",
        description: "Failed to complete pickup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCompletingRecords(prev => {
        const newSet = new Set(prev);
        newSet.delete(record.id);
        return newSet;
      });
    }
  };

  const canEdit = (record: any) => {
    if (userRole === 'reader') {
      return isPickupRecord(record);
    }
    return ['admin', 'staff'].includes(userRole);
  };

  const showCompleteButton = (record: any) => {
    return userRole === 'reader' && 
           isPickupRecord(record) && 
           !record.notes?.includes('[COMPLETED]');
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
              {userRole !== 'reader' && (
                <TableHead>
                  <Checkbox
                    checked={allSelected}
                    aria-label="Select all"
                    onCheckedChange={checked => onSelectAll && onSelectAll(Boolean(checked))}
                  />
                </TableHead>
              )}
              <TableHead>Name</TableHead>
              <TableHead>ID/Code</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Purpose</TableHead>
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
              const purpose = getPurpose(record);

              return (
                <TableRow key={record.id}>
                  {userRole !== 'reader' && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(record.id)}
                        aria-label="Select row"
                        onCheckedChange={checked => onToggleSelect && onToggleSelect(record.id, Boolean(checked))}
                      />
                    </TableCell>
                  )}
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
                      role === 'pickup/dropoff' ? 'bg-orange-100 text-orange-800' :
                      role === 'reader' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {organization}
                  </TableCell>
                  <TableCell>
                    {purpose}
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
                    <div className="flex space-x-2">
                      {canEdit(record) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRecord(record)}
                          disabled={editingRecord?.id === record.id}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {showCompleteButton(record) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompletePickup(record)}
                          disabled={completingRecords.has(record.id)}
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
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
