
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Users, TrendingUp } from "lucide-react";

interface DashboardMetricsProps {
  presentStudents: number;
  totalStudents: number;
  presentStaff: number;
  totalStaff: number;
}

// Make cards equal width/flex on desktop
export const DashboardMetrics = ({
  presentStudents,
  totalStudents,
  presentStaff,
  totalStaff,
}: DashboardMetricsProps) => (
  <div className="flex flex-col lg:flex-row gap-6">
    <Card className="flex-1 border-l-4 border-l-blue-500 min-w-[220px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            Students Present
          </CardTitle>
          <UserCheck className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{presentStudents}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          of {totalStudents} total
        </div>
      </CardContent>
    </Card>
    <Card className="flex-1 border-l-4 border-l-green-500 min-w-[220px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            Staff On-Site
          </CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">{presentStaff}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          of {totalStaff} total
        </div>
      </CardContent>
    </Card>
  </div>
);

