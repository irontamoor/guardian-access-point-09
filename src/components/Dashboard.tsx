import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserCheck, TrendingUp, Calendar, Download, AlertCircle, LogOut } from 'lucide-react';
import { useVMSData } from '@/hooks/useVMSData';

interface DashboardProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username: string; role: string };
}

const Dashboard = ({ onBack, onLogout, adminData }: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { students, staff, recentActivity } = useVMSData();

  const presentStudents = students.filter(s => s.status === 'present').length;
  const presentStaff = staff.filter(s => s.status === 'present').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {adminData.username}</span>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive visitor management system analytics</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Students Present</CardTitle>
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{presentStudents}</div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                of {students.length} total
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Staff On-Site</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentStaff}</div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                of {staff.length} total
              </div>
            </CardContent>
          </Card>
          {/* REMOVED visitors & pickups columns */}
        </div>

        {/* Recent Activity & Security Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest check-ins and registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-500">{activity.action}</div>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Security Alerts</span>
              </CardTitle>
              <CardDescription>Important security notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder alerts */}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-medium text-yellow-800">No Active Alerts</div>
                  <div className="text-sm text-yellow-600">Everything is operating normally.</div>
                  <div className="text-xs text-yellow-500 mt-1">No action required</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">System Status</div>
                  <div className="text-sm text-blue-600">VMS system running normally - all modules operational</div>
                  <div className="text-xs text-blue-500 mt-1">Real-time monitoring active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Status Boards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staff Status</CardTitle>
              <CardDescription>Current staff on-site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staff.filter(s => s.status === 'present').map((staffMember) => (
                  <div key={staffMember.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{staffMember.name}</div>
                      <div className="text-sm text-gray-500">{staffMember.id} • {staffMember.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">Present</div>
                      <div className="text-xs text-gray-500">Since {staffMember.check_in_time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Status</CardTitle>
              <CardDescription>Current students present</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.filter(s => s.status === 'present').map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.id} • {student.grade}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">Present</div>
                      <div className="text-xs text-gray-500">Since {student.check_in_time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
