
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Student, Staff } from "@/hooks/useVMSData";

interface DashboardLiveStatusBoardProps {
  staff: Staff[];
  students: Student[];
}

export const DashboardLiveStatusBoard = ({ staff, students }: DashboardLiveStatusBoardProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Staff Status</CardTitle>
        <CardDescription>Current staff on-site</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {staff
            .filter((s) => s.status === "present")
            .map((staffMember) => (
              <div
                key={staffMember.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {staffMember.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {staffMember.id} • {staffMember.department}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    Present
                  </div>
                  <div className="text-xs text-gray-500">
                    Since {staffMember.check_in_time}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Student Status</CardTitle>
        <CardDescription>Current students present</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students
            .filter((s) => s.status === "present")
            .map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">
                    {student.id} • {student.grade}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    Present
                  </div>
                  <div className="text-xs text-gray-500">
                    Since {student.check_in_time}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
