
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceManagement from './AttendanceManagement';

const ReaderDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📖</span>
              <span>Reader Dashboard</span>
            </CardTitle>
            <CardDescription>
              View attendance records and complete parent pickups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              As a reader, you can view all attendance records and mark parent pickups as completed.
            </p>
          </CardContent>
        </Card>

        <AttendanceManagement userRole="reader" />
      </div>
    </div>
  );
};

export default ReaderDashboard;
