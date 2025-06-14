
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { ActivityRecord } from "@/hooks/useVMSData";

interface DashboardActivityProps {
  recentActivity: ActivityRecord[];
}
export const DashboardActivity = ({ recentActivity }: DashboardActivityProps) => (
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
          <div
            key={activity.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                activity.status === "success"
                  ? "bg-green-500"
                  : activity.status === "warning"
                  ? "bg-orange-500"
                  : "bg-blue-500"
              }`}
            />
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
);
