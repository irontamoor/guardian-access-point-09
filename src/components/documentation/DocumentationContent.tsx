
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, UserCheck, UserPlus, Car, Database, Settings, Shield } from 'lucide-react';

export function DocumentationContent() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Documentation</h1>
        <p className="text-lg text-gray-600">Complete guide to using the School Visitor Management System</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="api">API Guide</TabsTrigger>
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
                    <li>• Database: PostgreSQL</li>
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
                  <BookOpen className="h-5 w-5 text-blue-600" />
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
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span>Staff Sign-In</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Employee ID authentication</li>
                  <li>• Time tracking for payroll</li>
                  <li>• Customizable sign-in reasons</li>
                  <li>• Forgot to sign-in alerts</li>
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
                  <li>• Automatic badge printing</li>
                  <li>• Security compliance</li>
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

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>API Reference</span>
              </CardTitle>
              <CardDescription>Direct database access methods for integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Users API</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <code>VMSApi.getUsers(role?)</code> - Get all users or by role<br/>
                    <code>VMSApi.createUser(userData)</code> - Create new user<br/>
                    <code>VMSApi.updateUser(id, userData)</code> - Update user<br/>
                    <code>VMSApi.deleteUser(id)</code> - Delete user
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Attendance API</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <code>VMSApi.getAttendanceRecords(date?)</code> - Get attendance records<br/>
                    <code>VMSApi.createAttendanceRecord(data)</code> - Create attendance record<br/>
                    <code>VMSApi.updateAttendanceRecord(id, data)</code> - Update attendance
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Visitors API</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <code>VMSApi.getVisitors()</code> - Get all visitors<br/>
                    <code>VMSApi.createVisitor(visitorData)</code> - Register new visitor
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Settings API</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <code>VMSApi.getSettings()</code> - Get system settings<br/>
                    <code>VMSApi.updateSetting(key, value)</code> - Update setting
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Installation & Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">1. Database Setup</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>• Install PostgreSQL</p>
                    <p>• Create database: <code>CREATE DATABASE school_vms;</code></p>
                    <p>• Run schema: <code>psql -d school_vms -f database/schema.sql</code></p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">2. Environment Variables</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>Set the following environment variables:</p>
                    <p>• <code>POSTGRES_HOST</code> - Database host</p>
                    <p>• <code>POSTGRES_PORT</code> - Database port (5432)</p>
                    <p>• <code>POSTGRES_DB</code> - Database name</p>
                    <p>• <code>POSTGRES_USER</code> - Database user</p>
                    <p>• <code>POSTGRES_PASSWORD</code> - Database password</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">3. Default Login</h3>
                  <div className="bg-gray-50 p-3 rounded mt-2 text-sm">
                    <p>Default admin credentials:</p>
                    <p>• Admin ID: <code>admin</code></p>
                    <p>• Password: <code>admin123</code></p>
                    <p className="text-red-600">⚠️ Change in production!</p>
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
