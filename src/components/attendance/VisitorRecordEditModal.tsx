import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { VisitorRecord } from '@/hooks/attendance/useVisitorRecordsData';
import { useToast } from '@/hooks/use-toast';

interface VisitorRecordEditModalProps {
  record: VisitorRecord | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<VisitorRecord>) => Promise<void>;
}

export function VisitorRecordEditModal({ record, onClose, onSave }: VisitorRecordEditModalProps) {
  const [formData, setFormData] = useState<Partial<VisitorRecord>>(
    record ? {
      first_name: record.first_name,
      last_name: record.last_name,
      organization: record.organization,
      visit_purpose: record.visit_purpose,
      host_name: record.host_name,
      phone_number: record.phone_number,
      status: record.status,
      notes: record.notes
    } : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!record) return;
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.visit_purpose || !formData.status) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(record.id, formData);
      toast({
        title: "Success",
        description: "Visitor record updated successfully",
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
          <DialogTitle>Edit Visitor Record</DialogTitle>
          <DialogDescription>
            Update the visitor information. Check-in/out times cannot be modified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
              placeholder="Enter organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit_purpose">Visit Purpose *</Label>
            <Input
              id="visit_purpose"
              value={formData.visit_purpose || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, visit_purpose: e.target.value }))}
              placeholder="Enter visit purpose"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="host_name">Host Name</Label>
            <Input
              id="host_name"
              value={formData.host_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, host_name: e.target.value }))}
              placeholder="Enter host name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status || ''}
              onValueChange={(value: 'in' | 'out') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Checked In</SelectItem>
                <SelectItem value="out">Checked Out</SelectItem>
              </SelectContent>
            </Select>
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