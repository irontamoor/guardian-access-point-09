
import { Users, BarChart3, Hourglass, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const menu = [
  { value: "overview", icon: BarChart3, label: "Overview" },
  { value: "dashboards", icon: Hourglass, label: "Dashboards" },
  { value: "users", icon: Users, label: "Users" },
  { value: "attendance", icon: Clock, label: "Attendance" }
];

export default function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  return (
    <nav className="min-h-screen bg-white/80 border-r border-blue-100 px-2 pt-6 pb-10 flex flex-col shadow-sm">
      <div className="mb-8 flex flex-col items-center">
        <img src="/favicon.ico" alt="Logo" className="w-12 h-12 rounded mb-2 border object-cover" />
        <span className="text-blue-900 font-bold text-xl">Jamiaa Al-Hudaa</span>
      </div>
      <ul className="flex-1 flex flex-col gap-2">
        {menu.map((item) => (
          <li key={item.value}>
            <Button
              variant={activeTab === item.value ? "default" : "ghost"}
              className={`w-full justify-start px-3 py-2 text-base rounded-lg font-semibold transition-shadow ${activeTab === item.value ? "bg-blue-600 text-white shadow" : "hover:bg-blue-100/80 text-blue-900"}`}
              onClick={() => setActiveTab(item.value)}
            >
              <item.icon className="mr-3 w-5 h-5" />
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
