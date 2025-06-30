
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { query } from "@/integrations/postgres/client";
import type { SystemUser, AttendanceRecord, Visitor } from "@/integrations/postgres/types";

interface AttendanceRecordWithUser extends AttendanceRecord {
  system_user?: SystemUser;
  visitor?: Visitor;
}

export default function AttendanceRecordsTable() {
  const [records, setRecords] = useState<AttendanceRecordWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      // Fetch all attendance records
      const attendanceResult = await query(`
        SELECT * FROM attendance_records 
        ORDER BY created_at DESC
      `);
      const attendance = attendanceResult.rows || [];

      // Get unique user IDs for system_users lookup
      const systemUserIds = Array.from(
        new Set(
          attendance
            .map((rec: any) => rec.user_id)
            .filter((id) => id)
        )
      );

      // Fetch system users
      let systemUsers: SystemUser[] = [];
      if (systemUserIds.length > 0) {
        const usersResult = await query(
          `SELECT id, first_name, last_name, role, email, phone 
           FROM system_users 
           WHERE id = ANY($1)`,
          [systemUserIds]
        );
        systemUsers = usersResult.rows || [];
      }

      // Get unique visitor IDs (those not found in system_users)
      const visitorIds = systemUserIds.filter(
        (id) => !systemUsers.find((user) => user.id === id)
      );

      // Fetch visitors
      let visitors: Visitor[] = [];
      if (visitorIds.length > 0) {
        const visitorsResult = await query(
          `SELECT id, first_name, last_name, organization, visit_purpose, host_name, phone_number 
           FROM visitors 
           WHERE id = ANY($1)`,
          [visitorIds]
        );
        visitors = visitorsResult.rows || [];
      }

      // Merge attendance records with user/visitor data
      const recordsWithUserData = attendance.map((rec: any) => ({
        ...rec,
        system_user: systemUsers.find((u) => u.id === rec.user_id),
        visitor: visitors.find((v) => v.id === rec.user_id),
      }));

      setRecords(recordsWithUserData);
    } catch (e: any) {
      setError(e.message || "Failed to fetch attendance records.");
      toast({
        title: "Error",
        description: e.message || "Failed to fetch attendance records.",
        variant: "destructive",
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDateTime = (dt?: string | null) =>
    dt ? new Date(dt).toLocaleString() : "-";

  const getPersonName = (record: AttendanceRecordWithUser) => {
    if (record.system_user) {
      return `${record.system_user.first_name} ${record.system_user.last_name}`;
    }
    if (record.visitor) {
      return `${record.visitor.first_name} ${record.visitor.last_name}`;
    }
    return record.user_id;
  };

  const getPersonType = (record: AttendanceRecordWithUser) => {
    if (record.system_user) {
      return record.system_user.role;
    }
    if (record.visitor) {
      return "visitor";
    }
    return "unknown";
  };

  const getContactInfo = (record: AttendanceRecordWithUser) => {
    if (record.system_user) {
      return record.system_user.email || "-";
    }
    if (record.visitor) {
      return record.visitor.phone_number || "-";
    }
    return "-";
  };

  const getOrganization = (record: AttendanceRecordWithUser) => {
    if (record.visitor) {
      return record.visitor.organization || "-";
    }
    return record.company || "-";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>Showing all attendance records including visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" onClick={fetchRecords} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {loading && <span className="text-blue-600 text-sm">Loading...</span>}
        </div>
        
        {error && <div className="text-red-700 bg-red-50 rounded p-2 mb-2">{error}</div>}
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{getPersonName(rec)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPersonType(rec) === "visitor"
                          ? "bg-purple-100 text-purple-800"
                          : getPersonType(rec) === "staff"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {getPersonType(rec)}
                      </span>
                    </TableCell>
                    <TableCell>{getContactInfo(rec)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.status === "in"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {rec.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateTime(rec.check_in_time)}</TableCell>
                    <TableCell>{formatDateTime(rec.check_out_time)}</TableCell>
                    <TableCell>{formatDateTime(rec.created_at)}</TableCell>
                    <TableCell>{getOrganization(rec)}</TableCell>
                    <TableCell>{rec.host_name || rec.visitor?.host_name || "-"}</TableCell>
                    <TableCell>{rec.purpose || rec.visitor?.visit_purpose || "-"}</TableCell>
                    <TableCell>{rec.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
