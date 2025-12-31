import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, ArrowDownToLine, ArrowUpFromLine, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentName: string;
  relationship: string;
  studentIds: string[];
  onComplete: () => void;
}

export function StudentSelectionDialog({
  open,
  onOpenChange,
  parentName,
  relationship,
  studentIds,
  onComplete
}: StudentSelectionDialogProps) {
  const [processingStudent, setProcessingStudent] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<'pickup' | 'dropoff' | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<string, 'pickup' | 'dropoff'>>({});
  const { toast } = useToast();

  const handleAction = async (studentId: string, actionType: 'pickup' | 'dropoff') => {
    setProcessingStudent(studentId);
    setProcessingAction(actionType);

    try {
      const { error } = await supabase
        .from('parent_pickup_records')
        .insert({
          student_id: studentId,
          parent_guardian_name: parentName,
          relationship: relationship,
          action_type: actionType,
          pickup_status: 'pending_approval',
          approved: false
        });

      if (error) throw error;

      setCompletedActions(prev => ({
        ...prev,
        [studentId]: actionType
      }));

      toast({
        title: actionType === 'pickup' ? 'Pickup Recorded' : 'Drop-off Recorded',
        description: `${actionType === 'pickup' ? 'Pickup' : 'Drop-off'} request for student ${studentId} has been submitted.`,
      });
    } catch (error) {
      console.error('Action error:', error);
      toast({
        title: 'Error',
        description: `Failed to record ${actionType}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setProcessingStudent(null);
      setProcessingAction(null);
    }
  };

  const handleClose = () => {
    setCompletedActions({});
    onOpenChange(false);
    onComplete();
  };

  const allCompleted = studentIds.every(id => completedActions[id]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Student</DialogTitle>
          <DialogDescription>
            Welcome, {parentName}! Select a student for pickup or drop-off.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {studentIds.map((studentId) => {
            const isProcessing = processingStudent === studentId;
            const completedAction = completedActions[studentId];
            
            return (
              <Card key={studentId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Student ID: {studentId}</p>
                      <p className="text-sm text-muted-foreground">{relationship}</p>
                    </div>
                  </div>

                  {completedAction ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium capitalize">{completedAction}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(studentId, 'pickup')}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing && processingAction === 'pickup' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ArrowUpFromLine className="w-4 h-4 mr-1" />
                            Pickup
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction(studentId, 'dropoff')}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isProcessing && processingAction === 'dropoff' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ArrowDownToLine className="w-4 h-4 mr-1" />
                            Drop-off
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleClose} variant={allCompleted ? "default" : "outline"}>
            {allCompleted ? 'Done' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
