import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { ParentPickupRecord } from '@/hooks/attendance/useParentPickupData';
import { useToast } from '@/hooks/use-toast';

interface ParentPickupEditModalProps {
  record: ParentPickupRecord | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<ParentPickupRecord>) => Promise<void>;
}

export function ParentPickupEditModal({ record, onClose, onSave }: ParentPickupEditModalProps) {
  const [formData, setFormData] = useState<Partial<ParentPickupRecord>>(
    record ? {
      student_id: record.student_id,
      student_name: record.student_name,
      parent_guardian_name: record.parent_guardian_name,
      relationship: record.relationship,
      pickup_type: record.pickup_type,
      action_type: record.action_type,
      notes: record.notes,
      action_time: record.action_time
    } : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!record) return;
    
    // Validate required fields
    if (!formData.student_id || !formData.parent_guardian_name || !formData.relationship || !formData.action_type) {
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
      
      // Auto-set action time if not provided
      if (!updates.action_time) {
        updates.action_time = new Date().toISOString();
      }
      
      await onSave(record.id, updates);
      toast({
        title: "Success",
        description: "Parent pickup record updated successfully",
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
          <DialogTitle>Edit Parent Pickup Record</DialogTitle>
          <DialogDescription>
            Update pickup/drop-off information. Action time can be modified.
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
            <Label htmlFor="student_name">Student Name</Label>
            <Input
              id="student_name"
              value={formData.student_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, student_name: e.target.value }))}
              placeholder="Enter student name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_name">Parent/Guardian Name *</Label>
            <Input
              id="parent_name"
              value={formData.parent_guardian_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_guardian_name: e.target.value }))}
              placeholder="Enter parent/guardian name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship *</Label>
            <Input
              id="relationship"
              value={formData.relationship || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              placeholder="e.g., Mother, Father, Guardian"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickup_type">Pickup Type</Label>
            <Input
              id="pickup_type"
              value={formData.pickup_type || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, pickup_type: e.target.value }))}
              placeholder="e.g., Regular, Early, Late"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action_type">Action Type *</Label>
            <Select
              value={formData.action_type || ''}
              onValueChange={(value: "pickup" | "dropoff") => setFormData(prev => ({ ...prev, action_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="action_time">Action Time</Label>
            <Input
              id="action_time"
              type="datetime-local"
              value={formData.action_time ? new Date(formData.action_time).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, action_time: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
            />
          </div>
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