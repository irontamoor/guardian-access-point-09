import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock, XCircle, AlertCircle, Car, ClipboardCheck, Phone } from 'lucide-react';

interface ParentPickupHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParentPickupHelp({ open, onOpenChange }: ParentPickupHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">
            How Parent Pickup Works
          </DialogTitle>
          <DialogDescription>
            A guide to using the parent pickup and drop-off system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-600" />
              Overview
            </h3>
            <p className="text-sm text-gray-700">
              This system allows parents and authorized guardians to securely pick up or drop off students. 
              All requests require office approval to ensure student safety.
            </p>
          </div>

          {/* Pickup Process */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-orange-600" />
              Pickup Process
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Submit Your Request</p>
                  <p className="text-sm text-gray-600">Enter the student ID and your information in the form below</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Wait for Approval</p>
                  <p className="text-sm text-gray-600">The office will review and approve your request</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Check Status</p>
                  <p className="text-sm text-gray-600">Use the "Pickup Status" button at the top to check your approval status</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Proceed to Pickup</p>
                  <p className="text-sm text-gray-600">Once approved, proceed to the designated pickup location</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Status Meanings */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Approval Status Meanings</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Pending</p>
                  <p className="text-xs text-gray-600">Waiting for office approval</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Approved</p>
                  <p className="text-xs text-gray-600">You're cleared to pick up the student</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Denied</p>
                  <p className="text-xs text-gray-600">Request was not approved - contact the office</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Completed</p>
                  <p className="text-xs text-gray-600">Student has been picked up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Important Notes:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Have the student's ID number ready</li>
                <li>You may be asked to show identification</li>
                <li>Only authorized guardians can pick up students</li>
                <li>Check your approval status regularly</li>
                <li>Contact the office if you have questions</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Drop-off */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="font-semibold mb-2">Drop-off Process</h3>
            <p className="text-sm text-gray-700">
              For drop-offs, follow the same process. Enter the student information and 
              select &quot;Drop-off&quot; as the action type.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              Need More Help?
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              If you have questions or need immediate assistance, please call our office:
            </p>
            <div className="bg-white rounded-md p-3 border border-green-200">
              <a 
                href="tel:01159690800" 
                className="text-2xl font-bold text-green-600 hover:text-green-700 block"
              >
                0115 969 0800
              </a>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold text-orange-600">Press Option 2</span> when prompted
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
