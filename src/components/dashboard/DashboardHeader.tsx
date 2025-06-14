
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onBack: () => void;
  onLogout: () => void;
  adminData: { username: string; role: string };
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const DashboardHeader = ({
  onBack,
  onLogout,
  adminData,
  selectedDate,
  setSelectedDate,
}: DashboardHeaderProps) => (
  <div className="max-w-7xl mx-auto mb-6">
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Welcome, {adminData.username}
        </span>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive visitor management system analytics
        </p>
      </div>
      <div className="flex space-x-3">
        <Button variant="outline">
          {/* You can swap to a Download icon here if you want */}
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
);
