
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, UserCheck, UserPlus, Car, Settings } from 'lucide-react';

export function DocumentationContent() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Documentation</h1>
        <p className="text-lg text-gray-600">Complete guide to using the School Visitor Management System</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The School Visitor Management System is a comprehensive solution for managing student attendance, staff sign-ins, visitor registration, and parent pickups.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Key Components</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Student Check-in/Check-out System</li>
                    <li>• Staff Attendance Tracking</li>
                    <li>• Visitor Registration & Badge Printing</li>
                    <li>• Parent Pickup Management</li>
                    <li>• Admin Dashboard & Reports</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Technology Stack</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Frontend: React + TypeScript</li>
                    <li>• Database: PostgreSQL via Supabase</li>
                    <li>• UI Framework: Tailwind CSS + shadcn/ui</li>
                    <li>• Build Tool: Vite</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <span>Student Check-In</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Quick ID-based sign in/out</li>
                  <li>• Automatic timestamp recording</li>
                  <li>• Notes and reason tracking</li>
                  <li>• Duplicate sign-in prevention</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Staff Sign-In</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Employee ID authentication</li>
                  <li>• Time tracking for attendance</li>
                  <li>• Customizable sign-in reasons</li>
                  <li>• Quick check-in/check-out</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                  <span>Visitor Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Complete visitor information capture</li>
                  <li>• Purpose and host tracking</li>
                  <li>• Security compliance</li>
                  <li>• Check-in/check-out tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-orange-600" />
                  <span>Parent Pickup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Safe child pickup tracking</li>
                  <li>• Parent/guardian verification</li>
                  <li>• Pickup authorization system</li>
                  <li>• Emergency contact management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">1. Admin Access</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>• Access admin dashboard via: <code>/admin</code> URL</p>
                    <p>• Use your admin credentials to log in</p>
                    <p>• Manage users, attendance, and system settings</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">2. User Management</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>• Add students, staff, and visitors through the admin panel</p>
                    <p>• Assign unique user codes for quick sign-in</p>
                    <p>• Configure user roles and permissions</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">3. System Configuration</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>• Configure sign-in options and reasons</p>
                    <p>• Set up dashboard visibility preferences</p>
                    <p>• Customize system settings for your school</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">4. Daily Operations</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>• Monitor attendance through the dashboard</p>
                    <p>• Edit attendance records when needed</p>
                    <p>• Generate reports and track activity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
