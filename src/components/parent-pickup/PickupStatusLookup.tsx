import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import { usePickupStatusLookup, getStatusConfig } from '@/hooks/usePickupStatusLookup';
import { format } from 'date-fns';

interface PickupStatusLookupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PickupStatusLookup({ open, onOpenChange }: PickupStatusLookupProps) {
  const [studentId, setStudentId] = useState('');
  const { lookupStatus, reset, isLoading, result, error } = usePickupStatusLookup();

  const handleLookup = () => {
    lookupStatus(studentId);
  };

  const handleCheckAnother = () => {
    setStudentId('');
    reset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLookup();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            Check Pickup Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-1">
          <div className="space-y-2">
            <Label htmlFor="student-id" className="text-sm sm:text-base">Student ID</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="student-id"
                placeholder="Enter student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 text-sm sm:text-base"
              />
              <Button 
                onClick={handleLookup} 
                disabled={isLoading || !studentId.trim()}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Checking...' : 'Check'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-muted border">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mt-0.5" />
              <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {result && (() => {
            const statusConfig = getStatusConfig(result.pickup_status);
            const IconComponent = {
              'Clock': Clock,
              'AlertCircle': AlertCircle,
              'CheckCircle2': CheckCircle2,
              'AlertTriangle': AlertTriangle
            }[statusConfig.icon];
            
            return (
              <div className="space-y-3 p-3 sm:p-4 rounded-lg border bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold text-sm sm:text-base">Pickup Details</h3>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <Badge className={statusConfig.color}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
                  </div>
                </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Student ID:</span>
                  <span className="ml-2 font-medium">{result.student_id}</span>
                </div>
                {result.student_name && (
                  <div>
                    <span className="text-muted-foreground">Student Name:</span>
                    <span className="ml-2 font-medium">{result.student_name}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Parent/Guardian:</span>
                  <span className="ml-2 font-medium">{result.parent_guardian_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Relationship:</span>
                  <span className="ml-2 font-medium">{result.relationship}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pickup Time:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(result.action_time), 'h:mm a')}
                  </span>
                </div>
                {result.pickup_type && (
                  <div>
                    <span className="text-muted-foreground">Pickup Type:</span>
                    <span className="ml-2 font-medium">{result.pickup_type}</span>
                  </div>
                )}
                {result.notes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="mt-1 text-sm">{result.notes}</p>
                  </div>
                )}
              </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleCheckAnother}
                >
                  Check Another Student
                </Button>
              </div>
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
