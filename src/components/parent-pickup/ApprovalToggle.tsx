import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ApprovalToggleProps {
  recordId?: string;
  approved: boolean;
  onApprovalChange: (approved: boolean) => void;
  disabled?: boolean;
}

export function ApprovalToggle({
  recordId,
  approved,
  onApprovalChange,
  disabled = false
}: ApprovalToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (newApprovalStatus: boolean) => {
    if (!recordId) {
      // For new records, just update local state
      onApprovalChange(newApprovalStatus);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('parent_pickup_records')
        .update({ approved: newApprovalStatus })
        .eq('id', recordId);

      if (error) throw error;

      onApprovalChange(newApprovalStatus);
      toast({
        title: newApprovalStatus ? "Record Approved" : "Approval Removed",
        description: newApprovalStatus 
          ? "The pickup record has been approved." 
          : "The approval has been removed from this record.",
      });
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast({
        title: "Error",
        description: "Failed to update approval status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center space-x-2">
        {approved ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Clock className="h-5 w-5 text-orange-500" />
        )}
        <Label htmlFor="approved" className="text-sm font-medium">
          Approved
        </Label>
      </div>
      <Switch
        id="approved"
        checked={approved}
        onCheckedChange={handleToggle}
        disabled={disabled || isUpdating}
      />
      <span className="text-sm text-muted-foreground">
        {approved ? "This pickup is approved" : "Pending approval"}
      </span>
    </div>
  );
}