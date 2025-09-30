import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import type { ActivityRecord } from "@/hooks/useActivityFeedState";

interface DashboardCheckInActivityProps {
  recentActivity: ActivityRecord[];
}

export const DashboardCheckInActivity = ({ recentActivity }: DashboardCheckInActivityProps) => {
  // Filter for check-in activities only
  const checkInActivity = recentActivity.filter(activity => 
    activity.action === 'Check In' || activity.action.toLowerCase().includes('check in')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogIn className="h-5 w-5 text-green-600" />
          <span>Recent Check-Ins</span>
        </CardTitle>
        <CardDescription>Latest check-ins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkInActivity.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent check-ins
            </div>
          ) : (
            checkInActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.name}</div>
                  <div className="text-sm text-gray-500">{activity.action}</div>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
