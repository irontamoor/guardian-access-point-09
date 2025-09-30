import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeTemplate } from './BadgeTemplate';
import { Printer } from 'lucide-react';
import { printBadge } from '@/utils/printService';

interface BadgePrintPreviewProps {
  open: boolean;
  onClose: () => void;
  visitorData: {
    first_name: string;
    last_name: string;
    visit_purpose: string;
    host_name: string;
    organization?: string;
    check_in_time: string;
  };
}

export function BadgePrintPreview({ open, onClose, visitorData }: BadgePrintPreviewProps) {
  const handlePrint = () => {
    printBadge();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Badge Preview</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <BadgeTemplate visitorData={visitorData} />
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700">
            <Printer className="h-4 w-4 mr-2" />
            Print Badge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
