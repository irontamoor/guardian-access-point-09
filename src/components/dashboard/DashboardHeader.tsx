
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
  adminData: {
    username?: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
}
export default function DashboardHeader({ onLogout, adminData }: DashboardHeaderProps) {
  const fullName =
    adminData.first_name || adminData.last_name
      ? `${adminData.first_name || ""} ${adminData.last_name || ""}`.trim()
      : adminData.username;
  return (
    <header className="w-full bg-white/90 border-b border-blue-100 py-4 px-6 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">Jamiaa Al-Hudaa Admin Dashboard</h1>
        <p className="text-sm text-blue-700/90">Safe, secure, and efficient visitor management</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right hidden md:block">
          <span className="block font-semibold text-base text-gray-900">{fullName || "—"}</span>
          <span className="block text-xs text-blue-600 font-medium">{adminData.role}</span>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-shadow shadow-sm ml-2"
          aria-label="Logout"
        >
          <LogOut className="inline-block mr-2 w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}
