import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Plus, X, CheckCircle2, Loader2 } from 'lucide-react';
import { captureFingerprint } from '@/utils/fingerprintService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RelationshipSelectEnhanced } from './RelationshipSelectEnhanced';

interface FingerprintRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FingerprintRegistrationForm({
  open,
  onOpenChange,
  onSuccess
}: FingerprintRegistrationFormProps) {
  const [parentName, setParentName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [studentIds, setStudentIds] = useState<string[]>(['']);
  const [fingerprintTemplate, setFingerprintTemplate] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setParentName('');
    setRelationship('');
    setStudentIds(['']);
    setFingerprintTemplate(null);
    setIsCapturing(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCaptureFingerprint = async () => {
    setIsCapturing(true);
    
    const result = await captureFingerprint();
    
    if (result.success && result.data) {
      setFingerprintTemplate(result.data.template);
      toast({
        title: 'Fingerprint Captured',
        description: `Quality: ${result.data.quality}%`,
      });
    } else {
      toast({
        title: 'Capture Failed',
        description: result.error || 'Failed to capture fingerprint',
        variant: 'destructive',
      });
    }
    
    setIsCapturing(false);
  };

  const addStudentId = () => {
    setStudentIds([...studentIds, '']);
  };

  const removeStudentId = (index: number) => {
    if (studentIds.length > 1) {
      setStudentIds(studentIds.filter((_, i) => i !== index));
    }
  };

  const updateStudentId = (index: number, value: string) => {
    const updated = [...studentIds];
    updated[index] = value;
    setStudentIds(updated);
  };

  const handleSubmit = async () => {
    // Validation
    if (!parentName.trim()) {
      toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
      return;
    }
    if (!relationship) {
      toast({ title: 'Error', description: 'Please select a relationship', variant: 'destructive' });
      return;
    }
    if (!fingerprintTemplate) {
      toast({ title: 'Error', description: 'Please capture your fingerprint', variant: 'destructive' });
      return;
    }
    const validStudentIds = studentIds.filter(id => id.trim());
    if (validStudentIds.length === 0) {
      toast({ title: 'Error', description: 'Please enter at least one student ID', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert fingerprint record
      const { data: fingerprintData, error: fingerprintError } = await supabase
        .from('parent_fingerprints')
        .insert({
          parent_guardian_name: parentName.trim(),
          relationship,
          fingerprint_template: fingerprintTemplate,
          is_approved: false
        })
        .select()
        .single();

      if (fingerprintError) throw fingerprintError;

      // Insert student links
      const linkInserts = validStudentIds.map(studentId => ({
        parent_fingerprint_id: fingerprintData.id,
        student_id: studentId.trim()
      }));

      const { error: linksError } = await supabase
        .from('parent_student_links')
        .insert(linkInserts);

      if (linksError) throw linksError;

      toast({
        title: 'Registration Submitted',
        description: 'Your fingerprint has been registered and is pending admin approval.',
      });

      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: 'Failed to register fingerprint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-violet-600" />
            Register Fingerprint
          </DialogTitle>
          <DialogDescription>
            Register your fingerprint to quickly identify yourself for pickups and drop-offs.
            Your registration will need to be approved by an administrator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Parent/Guardian Name */}
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name *</Label>
            <Input
              id="parentName"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <RelationshipSelectEnhanced
              value={relationship}
              onChange={setRelationship}
              loading={isSubmitting}
            />
          </div>

          {/* Student IDs */}
          <div className="space-y-2">
            <Label>Student ID(s) *</Label>
            <p className="text-xs text-muted-foreground">
              Enter the ID(s) of student(s) you are authorized to pick up
            </p>
            {studentIds.map((studentId, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={studentId}
                  onChange={(e) => updateStudentId(index, e.target.value)}
                  placeholder={`Student ID ${index + 1}`}
                />
                {studentIds.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStudentId(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStudentId}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Student
            </Button>
          </div>

          {/* Fingerprint Capture */}
          <div className="space-y-2">
            <Label>Fingerprint *</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {fingerprintTemplate ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-700">Fingerprint Captured</p>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={handleCaptureFingerprint}
                    disabled={isCapturing}
                  >
                    Recapture
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-3">
                    <Fingerprint className="w-8 h-8 text-violet-600" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleCaptureFingerprint}
                    disabled={isCapturing}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {isCapturing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Capture Fingerprint
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !fingerprintTemplate}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
