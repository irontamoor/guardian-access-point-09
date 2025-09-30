import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import type { ActivityRecord } from "@/hooks/useActivityFeedState";

interface DashboardCheckOutActivityProps {
  recentActivity: ActivityRecord[];
}

export const DashboardCheckOutActivity = ({ recentActivity }: DashboardCheckOutActivityProps) => {
  // Filter for check-out activities only
  const checkOutActivity = recentActivity.filter(activity => 
    activity.action === 'Check Out' || activity.action.toLowerCase().includes('check out')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogOut className="h-5 w-5 text-orange-600" />
          <span>Recent Check-Outs</span>
        </CardTitle>
        <CardDescription>Latest check-outs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkOutActivity.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No recent check-outs
            </div>
          ) : (
            checkOutActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-100"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500" />
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
