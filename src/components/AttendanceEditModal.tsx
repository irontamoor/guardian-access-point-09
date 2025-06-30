
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';
import * as React from 'react';

interface Props {
  editingRecord: any;
  editReason: string;
  isLoading: boolean;
  setEditingRecord: (rec: any | null) => void;
  setEditReason: (r: string) => void;
  handleEditAttendance: () => void;
}

export const AttendanceEditModal: React.FC<Props> = ({
  editingRecord,
  editReason,
  isLoading,
  setEditingRecord,
  setEditReason,
  handleEditAttendance
}) => {
  if (!editingRecord) return null;

  // Get the person's name from merged data structure
  const getPersonName = () => {
    // Use merged data first
    if (editingRecord.first_name && editingRecord.last_name) {
      return `${editingRecord.first_name} ${editingRecord.last_name}`;
    }
    // Fall back to system user data
    if (editingRecord.system_users) {
      return `${editingRecord.system_users.first_name} ${editingRecord.system_users.last_name}`;
    }
    return `Unknown User (${editingRecord.user_id})`;
  };

  // Get the person's type
  const getPersonType = () => {
    if (editingRecord.system_users) {
      return editingRecord.system_users.role;
    }
    // If has visitor data, it's a visitor
    if (editingRecord.organization || editingRecord.visit_purpose || editingRecord.phone_number) {
      return 'visitor';
    }
    return 'unknown';
  };

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle>Edit Attendance Record</CardTitle>
        <CardDescription>
          Editing attendance for {getPersonName()} ({getPersonType()})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={editingRecord.status}
              onValueChange={(value: any) =>
                setEditingRecord((prev) => prev ? { ...prev, status: value } : null)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">In</SelectItem>
                <SelectItem value="out">Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={editingRecord.notes || ''}
              onChange={(e) =>
                setEditingRecord((prev) => prev ? { ...prev, notes: e.target.value } : null)
              }
              placeholder="Additional notes"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="editReason">Reason for Edit (Required)</Label>
          <Textarea
            id="editReason"
            value={editReason}
            onChange={(e) => setEditReason(e.target.value)}
            placeholder="Please provide a reason for this attendance edit..."
            required
          />
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleEditAttendance} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            <UserCheck className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={() => setEditingRecord(null)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
