import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, UserCheck, Car, Shield, Settings, KeyRound, AlertTriangle, Edit } from 'lucide-react';
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
                Admin Dashboard - Complete Guide
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  The Admin Dashboard is the central hub for managing the entire visitor management system. Administrators can monitor real-time attendance, manage user records, edit historical data, and configure system-wide settings.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Access:</h4>
                <p className="text-muted-foreground">
                  Navigate to <code className="bg-gray-100 px-2 py-1 rounded">/admin</code> or click "Admin Access" on the homepage
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Login:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Enter your Admin ID or User Code</li>
                  <li>Enter your password</li>
                  <li>Click "Sign In"</li>
                  <li>Session remains active for 30 days with auto-refresh</li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-base font-bold mb-4">Dashboard Tabs Explained:</h3>
                
                {/* Tab 1: Dashboard Overview */}
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                    Dashboard Tab (Overview)
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    <strong>Purpose:</strong> Real-time overview of current system status and activity.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Metrics Displayed:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground">
                        <li><strong>Total Students:</strong> All registered students in the system</li>
                        <li><strong>Total Staff:</strong> All registered staff members</li>
                        <li><strong>Present Today:</strong> Currently checked-in users (IN status)</li>
                        <li><strong>Total Attendance Records:</strong> Historical attendance data count</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Live Status Board:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground">
                        <li>Shows who is currently checked in (real-time)</li>
                        <li>Updates automatically as people sign in/out</li>
                        <li>Separate sections for students and staff</li>
                        <li><strong>Use case:</strong> Emergency roll call, building occupancy monitoring</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Recent Activity Feed:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground">
                        <li><strong>Check-In Activity (left column):</strong> Recent arrivals with timestamps</li>
                        <li><strong>Check-Out Activity (right column):</strong> Recent departures</li>
                        <li>Shows name, time, and type (student/staff/visitor/pickup)</li>
                        <li><strong>Use case:</strong> Quick audit trail, monitoring daily traffic patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tab 2: Attendance Management */}
                <div className="mb-6 bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                    Attendance Tab (Records Management)
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    <strong>Purpose:</strong> View, search, filter, edit, and manage all attendance records across all user types.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="font-medium">Four Sub-Tabs:</p>
                    
                    <div className="ml-4 space-y-3">
                      <div>
                        <p className="font-medium text-orange-700">A. Parent Pickup/Drop-off:</p>
                        <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                          <li>View all parent pickup and drop-off requests</li>
                          <li>Approve or deny pickups for security verification</li>
                          <li>See who picked up which student and when</li>
                          <li>Track drop-off times and parent information</li>
                          <li>Edit pickup times, add notes, update approval status</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-yellow-700">B. Student Attendance:</p>
                        <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                          <li>All student check-in and check-out records</li>
                          <li>View daily attendance patterns and history</li>
                          <li>Edit records to correct timing mistakes</li>
                          <li>Add notes for absences, tardiness, early dismissals</li>
                          <li>Search by student ID or name</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-green-700">C. Staff Attendance:</p>
                        <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                          <li>Staff work hours tracking and history</li>
                          <li>View check-in and check-out times for payroll</li>
                          <li>Add notes for overtime, meetings, off-site work</li>
                          <li>Edit for timesheet corrections</li>
                          <li>Export for HR and payroll systems</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-purple-700">D. Visitor Records:</p>
                        <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                          <li>All visitor check-ins and check-outs</li>
                          <li>Track visitor purpose, host name, organization</li>
                          <li>See visitor duration of stay</li>
                          <li>View visitor badge information and photos</li>
                          <li>Edit visitor details and notes</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="font-medium">Features Available in All Tabs:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                        <li>Date range filtering (today, this week, custom dates)</li>
                        <li>Search by name, ID, or any field</li>
                        <li>Status filtering (in/out/pending approval)</li>
                        <li>Edit individual records (click on row or Edit button)</li>
                        <li>Mass edit selected records (bulk operations)</li>
                        <li>Delete records (admin only, permanent removal)</li>
                        <li>Export to CSV for reports and external analysis</li>
                        <li>View photos if camera capture was enabled</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tab 3: User Management */}
                <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                    Users Tab (User Management)
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    <strong>Purpose:</strong> Manage all system users including students, staff, admins, and other roles.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Core Features:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                        <li>View all users in the system in a searchable table</li>
                        <li>Filter by role (student, staff, admin, staff_admin, reader, parent, visitor)</li>
                        <li>Add new users with unique ID codes</li>
                        <li>Edit existing users (name, email, phone, ID code, role, status)</li>
                        <li>Reset passwords for admin-level users</li>
                        <li>Deactivate or reactivate user accounts</li>
                        <li>Delete users permanently (irreversible)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Understanding User Roles:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                        <li><strong>Student:</strong> Can sign in/out using student sign-in pages</li>
                        <li><strong>Staff:</strong> Can sign in/out using staff sign-in pages</li>
                        <li><strong>Admin:</strong> Full system access, can manage everything</li>
                        <li><strong>Staff Admin:</strong> Limited admin access (cannot manage other admins)</li>
                        <li><strong>Reader:</strong> View-only access to records + approve parent pickups</li>
                        <li><strong>Parent:</strong> For future parent portal features</li>
                        <li><strong>Visitor:</strong> For guest account functionality</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">Critical Fields Explained:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                        <li><strong>User Code/ID:</strong> The ID they use to sign in/out (e.g., "STU001", "EMP123")</li>
                        <li>Must be unique across the system</li>
                        <li>Cannot be empty - required for sign-in functionality</li>
                        <li>Recommended formats: Student IDs (STU001, 2024001), Staff codes (STAFF001, EMP123)</li>
                        <li><strong>Status:</strong> Active (can sign in), Inactive (disabled), Suspended (temporarily blocked)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tab 4: System Settings */}
                <div className="mb-6 bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
                    Settings Tab (System Configuration)
                  </h4>
                  <p className="text-muted-foreground mb-3">
                    <strong>Purpose:</strong> Configure system-wide settings and preferences that apply to all users.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">Available Settings:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground text-xs">
                        <li><strong>Dashboard Visibility:</strong> Toggle which sign-in options appear on the homepage (Student Sign In, Staff Sign In, Visitor Registration, Parent Pickup). Disable features your organization doesn't need.</li>
                        <li><strong>Photo Capture:</strong> Configure photo requirements separately for student and staff sign-in (required, optional, or disabled). Balance security needs with privacy preferences.</li>
                        <li><strong>School/Organization Information:</strong> Set the name displayed throughout the system and contact details.</li>
                        <li><strong>Notification Preferences:</strong> Configure which events trigger notifications (student check-in/out, staff check-in/out, visitor arrivals, parent pickups).</li>
                        <li><strong>Advanced Settings:</strong> Max visitors per day limit, auto sign-out hours (automatically check out users after X hours of inactivity).</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-100 border border-amber-300 p-2 rounded">
                      <p className="text-xs text-amber-900">
                        <strong>Note:</strong> All setting changes apply immediately across the entire system. Users may need to refresh their browser to see changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Session Management:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  <li>Admin sessions last 30 days with automatic refresh</li>
                  <li>Logout button available in top right corner</li>
                  <li>Sessions are encrypted and password-protected</li>
                  <li>Multiple admins can be logged in simultaneously</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Adding Staff & Students */}
          <AccordionItem value="adding-users" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Adding Staff & Students to the System
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  Before students or staff can sign in/out, they must be added to the system with a unique <strong>User Code/ID</strong>. This ID is what they'll enter on the sign-in pages to record their attendance.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Important:</strong> The <strong>User Code</strong> field is the ID students and staff use to sign in/out. Make sure each person knows their assigned code.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Step-by-Step: Adding a Student</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong>Login to Admin Dashboard</strong>
                    <p className="ml-6 text-xs">Navigate to /admin and sign in with your admin credentials</p>
                  </li>
                  <li>
                    <strong>Navigate to "Users" Tab</strong>
                    <p className="ml-6 text-xs">Click on the "Users" tab in the top navigation</p>
                  </li>
                  <li>
                    <strong>Click "Add User" Button</strong>
                    <p className="ml-6 text-xs">Located in the top right of the Users table</p>
                  </li>
                  <li>
                    <strong>Fill in Required Fields:</strong>
                    <ul className="ml-6 list-disc list-inside text-xs space-y-1 mt-1">
                      <li><strong>First Name:</strong> Student's first name</li>
                      <li><strong>Last Name:</strong> Student's last name</li>
                      <li><strong>User Code/ID:</strong> Unique identifier (e.g., "STU001", "2024001", "JOHN123")</li>
                      <li><strong>Role:</strong> Select "student" from dropdown</li>
                      <li><strong>Status:</strong> Select "active" to enable sign-in</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Optional Fields:</strong>
                    <ul className="ml-6 list-disc list-inside text-xs space-y-1 mt-1">
                      <li>Email address (for future notifications or parent portal)</li>
                      <li>Phone number (for emergency contacts)</li>
                      <li>Admin ID (leave blank for students)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Save the User</strong>
                    <p className="ml-6 text-xs">Click "Create User" - the student can now use their User Code to sign in/out</p>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Step-by-Step: Adding a Staff Member</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Follow the same process as adding a student (steps 1-3 above)</li>
                  <li>
                    <strong>Fill in Required Fields:</strong>
                    <ul className="ml-6 list-disc list-inside text-xs space-y-1 mt-1">
                      <li>First Name and Last Name</li>
                      <li><strong>User Code/ID:</strong> Employee code (e.g., "STAFF001", "EMP123", "JANE456")</li>
                      <li><strong>Role:</strong> Select "staff" from dropdown</li>
                      <li>Status: Select "active"</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Optional:</strong> Add email, phone, and employee-specific information
                  </li>
                  <li>
                    <strong>Save:</strong> Click "Create User" - staff member can now use their code on the Staff Sign In page
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">User Code Best Practices:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  <li><strong>Must be unique:</strong> No two users can have the same code</li>
                  <li><strong>Easy to remember:</strong> Use consistent formatting (STU001, STU002, etc.)</li>
                  <li><strong>Recommended formats:</strong>
                    <ul className="ml-6 list-disc list-inside mt-1">
                      <li>Students: "STU001", "2024001", "GRADE5-001"</li>
                      <li>Staff: "STAFF001", "EMP123", "TEACHER-JD"</li>
                    </ul>
                  </li>
                  <li>Avoid special characters that might be hard to type</li>
                  <li>Keep codes case-insensitive for easier entry</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Editing Existing Users:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                  <li>Go to Users tab in Admin Dashboard</li>
                  <li>Find the user in the table (use search or filter by role)</li>
                  <li>Click the "Edit" button next to their name</li>
                  <li>Update any field (name, code, email, phone, status)</li>
                  <li>Click "Save Changes"</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> Changing the User Code will require the person to use the new code for future sign-ins.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Deactivating Users:</h4>
                <p className="text-muted-foreground text-xs mb-2">
                  When a student graduates or staff member leaves, deactivate their account instead of deleting:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                  <li>Edit the user</li>
                  <li>Change Status from "active" to "inactive"</li>
                  <li>Save - they can no longer sign in, but historical records are preserved</li>
                </ol>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-sm text-green-900">
                  <strong>Tip:</strong> After adding users, inform them of their User Code and direct them to the appropriate sign-in page (Student Sign In or Staff Sign In on the homepage).
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Editing Attendance Records */}
          <AccordionItem value="editing-attendance" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <Edit className="h-5 w-5 mr-2 text-teal-600" />
                Editing Attendance Records & Adding Notes
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Overview:</h4>
                <p className="text-muted-foreground">
                  Administrators can edit any attendance record to correct mistakes, update times, add explanatory notes, or adjust statuses. This is essential for fixing errors and documenting special circumstances.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Where to Find Records:</h4>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
                  <li>Login to Admin Dashboard</li>
                  <li>Navigate to the <strong>"Attendance"</strong> tab</li>
                  <li>Choose the appropriate sub-tab:
                    <ul className="ml-6 list-disc list-inside mt-1">
                      <li><strong>Parent Pickup/Drop-off:</strong> For parent pickup and drop-off records</li>
                      <li><strong>Student Attendance:</strong> For student check-in/out records</li>
                      <li><strong>Staff Attendance:</strong> For staff work hours and attendance</li>
                      <li><strong>Visitor Records:</strong> For visitor check-ins and check-outs</li>
                    </ul>
                  </li>
                  <li>Use filters and search to find the specific record</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-3">How to Edit a Record:</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>
                    <strong>Locate the Record</strong>
                    <p className="ml-6 text-xs">Use date filters, search by name/ID, or scroll through the table</p>
                  </li>
                  <li>
                    <strong>Open Edit Modal</strong>
                    <p className="ml-6 text-xs">Click on the record row or click the "Edit" button next to it</p>
                  </li>
                  <li>
                    <strong>Modify Fields</strong>
                    <p className="ml-6 text-xs">Edit modal opens with all record details - update any field as needed:</p>
                    <ul className="ml-6 list-disc list-inside text-xs mt-1 space-y-1">
                      <li>Check-in time (correct if someone forgot to sign in)</li>
                      <li>Check-out time (correct if someone forgot to sign out)</li>
                      <li>Status (change from "in" to "out" or vice versa)</li>
                      <li>Notes (add context, reasons, special circumstances)</li>
                      <li>Approval status (for parent pickups)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Save Changes</strong>
                    <p className="ml-6 text-xs">Click "Save Changes" button - updates are immediate</p>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Common Editing Use Cases:</h4>
                <div className="space-y-3 ml-4">
                  <div>
                    <p className="font-medium text-xs">1. Correcting Check-In/Out Times:</p>
                    <p className="text-muted-foreground text-xs ml-4">
                      <strong>Scenario:</strong> A student arrived at 8:00 AM but forgot to sign in until 10:00 AM.<br/>
                      <strong>Solution:</strong> Edit the check-in time to 8:00 AM and add a note: "Corrected - student forgot to sign in upon arrival"
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs">2. Adding Explanatory Notes:</p>
                    <p className="text-muted-foreground text-xs ml-4">
                      <strong>Scenario:</strong> Staff member left early for a doctor's appointment.<br/>
                      <strong>Solution:</strong> Edit the check-out record and add note: "Early departure - doctor's appointment, pre-approved by supervisor"
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs">3. Updating Status:</p>
                    <p className="text-muted-foreground text-xs ml-4">
                      <strong>Scenario:</strong> Student is marked as "in" but already left.<br/>
                      <strong>Solution:</strong> Change status to "out" and add appropriate check-out time with note: "Manually checked out - forgot to sign out"
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-xs">4. Approving Parent Pickups:</p>
                    <p className="text-muted-foreground text-xs ml-4">
                      <strong>Scenario:</strong> Parent pickup awaiting approval.<br/>
                      <strong>Solution:</strong> Open the pickup record, verify parent identity, toggle approval status to "Approved", add note if needed
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Bulk Actions Available:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  <li><strong>Mass Edit:</strong> Select multiple records (checkboxes) and edit common fields at once</li>
                  <li><strong>Bulk Delete:</strong> Select multiple records and delete them permanently (use with caution)</li>
                  <li><strong>Export to CSV:</strong> Export selected or all records for external reporting and analysis</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Search and Filter Capabilities:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                  <li><strong>Date Range Filter:</strong> Today, Yesterday, This Week, This Month, Custom Date Range</li>
                  <li><strong>Search:</strong> Search by name, ID, or any field in real-time</li>
                  <li><strong>Status Filter:</strong> Filter by status (in, out, pending approval)</li>
                  <li><strong>Role Filter:</strong> Filter by user type (student, staff, visitor, parent)</li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-sm text-amber-900">
                  <strong>Best Practice:</strong> Always add a note when editing records to document why the change was made. This creates an audit trail and helps with future reference.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-sm text-red-900">
                  <strong>Warning:</strong> Deleting records is permanent and cannot be undone. Use the deactivate or edit features instead when possible. Only delete duplicate or erroneous entries.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Admin Password Reset */}
          <AccordionItem value="admin-password-reset" className="bg-white rounded-lg px-6">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center">
                <KeyRound className="h-5 w-5 mr-2 text-red-600" />
                Admin Password Reset (Forgotten Password)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Security Warning</h4>
                    <p className="text-amber-800 text-xs">
                      Password resets require direct database access. Only authorized database administrators should perform these operations. All passwords are encrypted using bcrypt hashing.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Method 1: Using Supabase Dashboard (Recommended)</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Log in to your Supabase dashboard at <a href="https://supabase.com" className="text-blue-600 underline" target="_blank">supabase.com</a></li>
                  <li>Select your project and navigate to <strong>SQL Editor</strong></li>
                  <li>Run the following SQL command (replace values with actual data):</li>
                </ol>
                <div className="mt-2 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs font-mono">
{`-- Reset password for an admin user
UPDATE system_users
SET password = crypt('NEW_PASSWORD_HERE', gen_salt('bf', 10))
WHERE admin_id = 'ADMIN_ID_HERE'
  AND role IN ('admin', 'reader', 'staff_admin');

-- Verify the update
SELECT admin_id, email, role, first_name, last_name
FROM system_users
WHERE admin_id = 'ADMIN_ID_HERE';`}
                  </pre>
                </div>
                <div className="mt-2 bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-xs text-blue-900">
                    <strong>Example:</strong> If admin ID is "ADMIN001" and new password is "SecurePass123", replace 'ADMIN_ID_HERE' with 'ADMIN001' and 'NEW_PASSWORD_HERE' with 'SecurePass123'.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Method 2: Using SQL Client (pgAdmin, DBeaver, etc.)</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Connect to your PostgreSQL database using your SQL client</li>
                  <li>Use the connection details from your Supabase project settings</li>
                  <li>Execute the same SQL command as Method 1</li>
                  <li>Verify the password was updated successfully</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Method 3: Using Another Admin Account</h4>
                <p className="text-muted-foreground mb-2">
                  If another admin has access to the Admin Dashboard:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Log in to Admin Dashboard</li>
                  <li>Navigate to <strong>Users</strong> tab</li>
                  <li>Find the admin user in the list</li>
                  <li>Click <strong>Reset Password</strong> button</li>
                  <li>Enter and confirm the new password</li>
                  <li>Save changes</li>
                </ol>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Important Security Notes</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-800 text-xs">
                      <li>Always use strong passwords (minimum 8 characters, mix of letters, numbers, symbols)</li>
                      <li>Never share database credentials</li>
                      <li>The system automatically hashes passwords using bcrypt with 10 rounds</li>
                      <li>Password changes take effect immediately</li>
                      <li>Users will need to log in again with the new password</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Troubleshooting:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Still can't login:</strong> Verify the admin_id is correct (check for spaces/typos)</li>
                  <li><strong>SQL error:</strong> Ensure pgcrypto extension is enabled: <code className="bg-gray-100 px-2 py-1 rounded text-xs">CREATE EXTENSION IF NOT EXISTS pgcrypto;</code></li>
                  <li><strong>No database access:</strong> Contact your hosting provider or system administrator</li>
                  <li><strong>Password not working:</strong> Clear browser cache and try again</li>
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
