
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import * as React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  status: "in" | "out";
  onStatusChange: (v: "in" | "out") => void;
  editReason: string;
  setEditReason: (reason: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

export const AttendanceMassEditModal: React.FC<Props> = ({
  open,
  onClose,
  selectedCount,
  status,
  onStatusChange,
  editReason,
  setEditReason,
  loading,
  onSubmit,
}) => {
  if (!open) return null;
  return (
    <Card className="border-l-4 border-l-blue-500 max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Mass Edit Attendance</CardTitle>
        <CardDescription>
          Update attendance status for <b>{selectedCount}</b> records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
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
          <Label htmlFor="massEditReason">Reason for Edit (required)</Label>
          <Textarea
            id="massEditReason"
            value={editReason}
            onChange={e => setEditReason(e.target.value)}
            placeholder="Please provide a reason for this mass edit..."
            required
          />
        </div>
        <div className="flex space-x-3">
          <Button onClick={onSubmit} disabled={loading || !editReason.trim()}>
            Confirm
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
