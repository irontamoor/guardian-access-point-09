import { Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FingerprintScanButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function FingerprintScanButton({ onClick, disabled }: FingerprintScanButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
    >
      <Fingerprint className="w-6 h-6 mr-3" />
      Fingerprint Scan
    </Button>
  );
}
