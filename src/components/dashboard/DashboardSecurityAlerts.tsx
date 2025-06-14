
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export const DashboardSecurityAlerts = () => (
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
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="font-medium text-yellow-800">No Active Alerts</div>
          <div className="text-sm text-yellow-600">
            Everything is operating normally.
          </div>
          <div className="text-xs text-yellow-500 mt-1">No action required</div>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="font-medium text-blue-800">System Status</div>
          <div className="text-sm text-blue-600">
            VMS system running normally - all modules operational
          </div>
          <div className="text-xs text-blue-500 mt-1">
            Real-time monitoring active
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
