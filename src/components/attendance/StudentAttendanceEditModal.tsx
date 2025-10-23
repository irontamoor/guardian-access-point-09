import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { StudentAttendanceRecord } from '@/hooks/attendance/useStudentAttendanceData';
import { useToast } from '@/hooks/use-toast';

interface StudentAttendanceEditModalProps {
  record: StudentAttendanceRecord | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<StudentAttendanceRecord>) => Promise<void>;
}

export function StudentAttendanceEditModal({ record, onClose, onSave }: StudentAttendanceEditModalProps) {
  const [formData, setFormData] = useState<Partial<StudentAttendanceRecord>>(
    record ? {
      student_id: record.student_id,
      student_name: record.student_name,
      status: record.status,
      notes: record.notes,
      check_out_time: record.check_out_time
    } : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!record) return;
    
    // Validate required fields
    if (!formData.student_id || !formData.student_name || !formData.status) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const updates = { ...formData };
      
      // Auto-set checkout time if status is "out" and no checkout time exists
      if (updates.status === 'out' && !updates.check_out_time) {
        updates.check_out_time = new Date().toISOString();
      }
      
      // Clear checkout time if status changed back to "in"
      if (updates.status === 'in') {
        updates.check_out_time = null;
      }
      
      await onSave(record.id, updates);
      toast({
        title: "Success",
        description: "Student attendance record updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={!!record} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Student Attendance Record</DialogTitle>
          <DialogDescription>
            Update student information. Checkout time can be modified when status is 'Signed Out'.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Student ID *</Label>
            <Input
              id="student_id"
              value={formData.student_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
              placeholder="Enter student ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="student_name">Student Name *</Label>
            <Input
              id="student_name"
              value={formData.student_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, student_name: e.target.value }))}
              placeholder="Enter student name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status || ''}
              onValueChange={(value: 'in' | 'out') => {
                const updates: any = { status: value };
                
                // Auto-populate checkout time if changing to "out"
                if (value === 'out' && !record?.check_out_time && !formData.check_out_time) {
                  updates.check_out_time = new Date().toISOString();
                }
                
                setFormData(prev => ({ ...prev, ...updates }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Signed In</SelectItem>
                <SelectItem value="out">Signed Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.status === 'out' && (
            <div className="space-y-2">
              <Label htmlFor="check_out_time">Checkout Time</Label>
              <Input
                id="check_out_time"
                type="datetime-local"
                value={formData.check_out_time ? new Date(formData.check_out_time).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}