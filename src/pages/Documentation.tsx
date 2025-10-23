import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, UserCheck, Car, Shield, Settings } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DocumentationProps {
  onBack: () => void;
}

const Documentation = ({ onBack }: DocumentationProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-3xl">System Documentation</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Complete guide to using the Jamia Al-Hudaa Visitor Management System
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Start Guide */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">For Students:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Student Sign In" on the home page</li>
                  <li>Enter your student ID code</li>
                  <li>Click "Sign In" or "Sign Out"</li>
                  <li>Take photo if required (auto-capture after 3 seconds)</li>
                  <li>Confirm and you're done!</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Staff:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Staff Sign In" on the home page</li>
                  <li>Enter your employee code</li>
                  <li>Click "Sign In" or "Sign Out"</li>
                  <li>Take photo if required</li>
                  <li>Done!</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feature Documentation */}
        <Accordion type="single" collapsible className="space-y-4">
          
          {/* Student Sign-In */}
          <AccordionItem value="student-signin" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-yellow-600" />
                Student Sign-In System
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  The student sign-in system tracks daily attendance for all students. Each student has a unique ID code that allows them to check in and out.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How to Use:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>Access:</strong> Click "Student Sign In" from the home page</li>
                  <li><strong>Enter ID:</strong> Type your unique student ID code in the input field</li>
                  <li><strong>Action:</strong> Click either "Sign In" (arriving) or "Sign Out" (leaving)</li>
                  <li><strong>Photo (if enabled):</strong> Camera will open with 3-second countdown, auto-capture, then confirm/retake</li>
                  <li><strong>Optional Notes:</strong> Add any notes before submitting</li>
                  <li><strong>Confirmation:</strong> Success message appears and you're checked in/out</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Common Issues:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>"Already checked in":</strong> You've already signed in today. Use "Sign Out" instead.</li>
                  <li><strong>"Invalid ID":</strong> Contact admin to verify your student ID code</li>
                  <li><strong>Camera not working:</strong> Grant browser camera permissions or contact IT support</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Staff Sign-In */}
          <AccordionItem value="staff-signin" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Staff Sign-In System
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  Staff members use this system to track their daily work hours, check-in upon arrival, and check-out when leaving.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How to Use:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>Access:</strong> Click "Staff Sign In" from the home page</li>
                  <li><strong>Enter Employee Code:</strong> Type your unique employee code</li>
                  <li><strong>Action:</strong> Click "Sign In" when arriving or "Sign Out" when leaving</li>
                  <li><strong>Photo (if enabled):</strong> Take photo if required by admin settings</li>
                  <li><strong>Notes:</strong> Add any relevant notes (optional)</li>
                  <li><strong>Submit:</strong> Confirm your attendance record</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Visitor Registration */}
          <AccordionItem value="visitor-registration" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Visitor Registration System
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  All visitors must register upon arrival. The system creates a visitor badge and tracks check-in/check-out times.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How to Register a Visitor:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>Access:</strong> Click "Visitor Registration" from home page</li>
                  <li><strong>Fill Required Fields:</strong> First Name, Last Name, Purpose of Visit, Host/Contact Person</li>
                  <li><strong>Optional Fields:</strong> Organization, Phone, Vehicle Registration, Notes</li>
                  <li><strong>Photo:</strong> Take visitor photo (camera auto-captures)</li>
                  <li><strong>Submit:</strong> Print visitor badge if needed</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Parent Pickup */}
          <AccordionItem value="parent-pickup" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-orange-600" />
                Parent Pickup/Dropoff System
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  Track when students are picked up or dropped off by parents/guardians. Includes approval workflow for security.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How to Record Pickup/Dropoff:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><strong>Access:</strong> Click "Parent Pickup" from home page</li>
                  <li><strong>Enter Student ID:</strong> Type the student's ID code</li>
                  <li><strong>Parent Info:</strong> Parent/Guardian Name and Relationship</li>
                  <li><strong>Pickup Type:</strong> Select "Early Pickup" or "End of Day Pickup"</li>
                  <li><strong>Action:</strong> Choose "Pickup" or "Dropoff"</li>
                  <li><strong>Photo:</strong> Take photo of parent/guardian (auto-capture)</li>
                  <li><strong>Submit:</strong> Record is created and awaits approval if enabled</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Admin Dashboard */}
          <AccordionItem value="admin-dashboard" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Admin Dashboard
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Access:</h4>
                <p className="text-muted-foreground">
                  Navigate to <code className="bg-gray-100 px-2 py-1 rounded">/admin</code> or click "Admin Access" on homepage
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Login:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Enter your Admin ID or User Code</li>
                  <li>Enter your password</li>
                  <li>Click "Sign In"</li>
                  <li>You'll remain logged in (30-day session)</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dashboard Tabs:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Dashboard:</strong> Overview metrics, live status, recent activity</li>
                  <li><strong>Attendance:</strong> View/edit all attendance records</li>
                  <li><strong>Users:</strong> Manage students, staff, and admin users</li>
                  <li><strong>Settings:</strong> Configure system settings, notifications, photo requirements</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        {/* Security & Privacy */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Password Security:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>All passwords are encrypted using bcrypt hashing</li>
                <li>Passwords are verified server-side only</li>
                <li>Never share your password with anyone</li>
                <li>Use strong passwords (min 8 characters)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Session Management:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Admin sessions last 30 days with auto-refresh</li>
                <li>Sessions extend on user activity</li>
                <li>Always log out on shared computers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Privacy:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Photos and personal data are securely stored</li>
                <li>Access restricted by role-based permissions</li>
                <li>Attendance data is confidential</li>
                <li>Audit logs track all data changes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground mb-4">
              If you encounter issues or have questions not covered in this documentation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Contact your system administrator</li>
              <li>Check the admin dashboard for technical information</li>
              <li>Review the console logs for technical errors</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
