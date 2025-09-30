import UserManagement from "../UserManagement";

interface AdminUserManagementProps {
  adminData: any;
}

export function AdminUserManagement({ adminData }: AdminUserManagementProps) {
  return (
    <div className="space-y-6">
      <UserManagement adminData={adminData} />
    </div>
  );
}
