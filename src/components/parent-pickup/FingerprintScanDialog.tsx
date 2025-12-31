import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Fingerprint, CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { captureFingerprint, findMatchingFingerprint, checkServiceAvailable } from '@/utils/fingerprintService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ScanStatus = 'idle' | 'checking' | 'ready' | 'scanning' | 'matching' | 'matched' | 'pending' | 'not-found' | 'error' | 'service-unavailable';

interface ParentFingerprint {
  id: string;
  parent_guardian_name: string;
  relationship: string;
  fingerprint_template: string;
  is_approved: boolean;
}

interface FingerprintScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMatchFound: (parentData: ParentFingerprint, studentIds: string[]) => void;
  onRegisterNew: () => void;
}

export function FingerprintScanDialog({
  open,
  onOpenChange,
  onMatchFound,
  onRegisterNew
}: FingerprintScanDialogProps) {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      checkService();
    } else {
      setStatus('idle');
      setErrorMessage('');
    }
  }, [open]);

  const checkService = async () => {
    setStatus('checking');
    const result = await checkServiceAvailable();
    
    if (result.success && result.data) {
      setStatus('ready');
    } else {
      setStatus('service-unavailable');
      setErrorMessage(result.error || 'Fingerprint service not available');
    }
  };

  const startScan = async () => {
    setStatus('scanning');
    setErrorMessage('');

    // Capture fingerprint
    const captureResult = await captureFingerprint();
    
    if (!captureResult.success || !captureResult.data) {
      setStatus('error');
      setErrorMessage(captureResult.error || 'Failed to capture fingerprint');
      return;
    }

    setStatus('matching');

    // Fetch all fingerprints from database
    const { data: fingerprints, error: fetchError } = await supabase
      .from('parent_fingerprints')
      .select('id, parent_guardian_name, relationship, fingerprint_template, is_approved');

    if (fetchError) {
      setStatus('error');
      setErrorMessage('Failed to fetch fingerprint records');
      return;
    }

    if (!fingerprints || fingerprints.length === 0) {
      setStatus('not-found');
      return;
    }

    // Find matching fingerprint
    const templates = fingerprints.map(f => ({
      id: f.id,
      template: f.fingerprint_template
    }));

    const matchResult = await findMatchingFingerprint(captureResult.data.template, templates);

    if (!matchResult.success) {
      setStatus('error');
      setErrorMessage(matchResult.error || 'Matching failed');
      return;
    }

    if (!matchResult.data?.matchedId) {
      setStatus('not-found');
      return;
    }

    // Found a match - check approval status
    const matchedFingerprint = fingerprints.find(f => f.id === matchResult.data?.matchedId);
    
    if (!matchedFingerprint) {
      setStatus('not-found');
      return;
    }

    if (!matchedFingerprint.is_approved) {
      setStatus('pending');
      return;
    }

    // Get linked student IDs
    const { data: links, error: linksError } = await supabase
      .from('parent_student_links')
      .select('student_id')
      .eq('parent_fingerprint_id', matchedFingerprint.id);

    if (linksError) {
      setStatus('error');
      setErrorMessage('Failed to fetch student links');
      return;
    }

    const studentIds = links?.map(l => l.student_id) || [];
    
    setStatus('matched');
    
    // Short delay to show success state
    setTimeout(() => {
      onMatchFound(matchedFingerprint as ParentFingerprint, studentIds);
      onOpenChange(false);
    }, 1000);
  };

  const handleRegisterNew = () => {
    onOpenChange(false);
    onRegisterNew();
  };

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-16 h-16 text-violet-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">Checking scanner...</p>
          </div>
        );

      case 'service-unavailable':
        return (
          <div className="flex flex-col items-center py-8">
            <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Scanner Not Available</p>
            <p className="text-sm text-gray-500 text-center mb-4">{errorMessage}</p>
            <Button onClick={checkService} variant="outline">
              Try Again
            </Button>
          </div>
        );

      case 'ready':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mb-4">
              <Fingerprint className="w-12 h-12 text-violet-600" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Ready to Scan</p>
            <p className="text-sm text-gray-500 text-center mb-6">
              Click the button below and place your finger on the scanner
            </p>
            <Button 
              onClick={startScan}
              className="bg-violet-600 hover:bg-violet-700 px-8 py-3"
              size="lg"
            >
              <Fingerprint className="w-5 h-5 mr-2" />
              Start Scan
            </Button>
          </div>
        );

      case 'scanning':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-violet-100 flex items-center justify-center mb-4 animate-pulse">
              <Fingerprint className="w-12 h-12 text-violet-600" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">Scanning...</p>
            <p className="text-sm text-gray-500 text-center">
              Place your finger on the scanner and hold still
            </p>
          </div>
        );

      case 'matching':
        return (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-16 h-16 text-violet-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">Matching fingerprint...</p>
          </div>
        );

      case 'matched':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-lg font-medium text-green-700">Match Found!</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        );

      case 'pending':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
            <p className="text-lg font-medium text-amber-700 mb-2">Awaiting Approval</p>
            <p className="text-sm text-gray-500 text-center mb-4">
              Your fingerprint registration is pending admin approval.
              Please check back later or use the manual form.
            </p>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Close
            </Button>
          </div>
        );

      case 'not-found':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-gray-500" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">No Match Found</p>
            <p className="text-sm text-gray-500 text-center mb-6">
              Your fingerprint is not registered in the system.
              Would you like to register now?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleRegisterNew} className="bg-violet-600 hover:bg-violet-700">
                Register Fingerprint
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center py-8">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <p className="text-lg font-medium text-red-700 mb-2">Error</p>
            <p className="text-sm text-gray-500 text-center mb-4">{errorMessage}</p>
            <Button onClick={startScan} variant="outline">
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-violet-600" />
            Fingerprint Scan
          </DialogTitle>
          <DialogDescription>
            Scan your fingerprint to quickly identify yourself
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
