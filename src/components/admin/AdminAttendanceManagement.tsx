
import AttendanceManagement from "../AttendanceManagement";

interface AdminAttendanceManagementProps {
  adminData: any;
}

export function AdminAttendanceManagement({ adminData }: AdminAttendanceManagementProps) {
  return (
    <div className="space-y-6">
      <AttendanceManagement adminData={adminData} />
    </div>
  );
}
