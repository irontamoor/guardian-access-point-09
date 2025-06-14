
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Student, Staff } from "@/hooks/useVMSData";

interface DashboardLiveStatusBoardProps {
  staff: Staff[];
  students: Student[];
}

export const DashboardLiveStatusBoard = ({ students }: DashboardLiveStatusBoardProps) => (
  <div className="grid grid-cols-1 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Students Present</CardTitle>
        <CardDescription>Currently checked in students</CardDescription>
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
          {students.filter((s) => s.status === "present").length === 0 && (
            <div className="text-gray-500 text-sm text-center py-5">
              No students currently present.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);
