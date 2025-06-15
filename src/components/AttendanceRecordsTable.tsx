
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
}

interface VisitorInfo {
  id: string;
  first_name: string;
  last_name: string;
  organization?: string | null;
  visit_purpose: string;
  host_name?: string | null;
  phone_number?: string | null;
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  status: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  created_at: string;
  created_by?: string | null;
  host_name?: string | null;
  company?: string | null;
  notes?: string | null;
  purpose?: string | null;
  system_user?: UserInfo;
  visitor?: VisitorInfo;
}

export default function AttendanceRecordsTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Debug UI state
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  // DEBUG: user session info
  useEffect(() => {
    async function debugUser() {
      const { data: { user }, error } = await supabase.auth.getUser();

      let sysUser = null;
      let roleRow = null;
      if (user) {
        // Find corresponding system_user
        const { data: sysUserData } = await supabase
          .from("system_users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        sysUser = sysUserData;

        // Find admin role assignment
        const { data: roleRowData } = await supabase
          .from("user_role_assignments")
          .select("*")
          .eq("user_id", user.id)
          .eq("role", "admin");

        roleRow = roleRowData;
      }
      setDebugInfo({
        supabaseUser: user,
        supabaseUserError: error,
        systemUser: sysUser,
        adminRoleAssignments: roleRow,
      });
      console.log("[AttendanceRecordsTable] Supabase User:", user, error);
      console.log("[AttendanceRecordsTable] system_users row:", sysUser);
      console.log("[AttendanceRecordsTable] admin role assignments:", roleRow);
    }
    debugUser();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      // Fetch all attendance records
      const { data: attendance, error: arError } = await supabase
        .from("attendance_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (arError) throw arError;

      // Get unique user IDs for system_users lookup
      const systemUserIds = Array.from(
        new Set(
          (attendance ?? [])
            .map((rec: any) => rec.user_id)
            .filter((id) => id)
        )
      );

      // Fetch system users
      let systemUsers: UserInfo[] = [];
      if (systemUserIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("system_users")
          .select("id, first_name, last_name, role, email, phone")
          .in("id", systemUserIds);
        if (usersError) throw usersError;
        systemUsers = usersData || [];
      }

      // Get unique visitor IDs (those not found in system_users)
      const visitorIds = systemUserIds.filter(
        (id) => !systemUsers.find((user) => user.id === id)
      );

      // Fetch visitors
      let visitors: VisitorInfo[] = [];
      if (visitorIds.length > 0) {
        const { data: visitorsData, error: visitorsError } = await supabase
          .from("visitors")
          .select("id, first_name, last_name, organization, visit_purpose, host_name, phone_number")
          .in("id", visitorIds);
        if (visitorsError) throw visitorsError;
        visitors = visitorsData || [];
      }

      // Merge attendance records with user/visitor data
      const recordsWithUserData = (attendance ?? []).map((rec: any) => ({
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

  const getPersonName = (record: AttendanceRecord) => {
    if (record.system_user) {
      return `${record.system_user.first_name} ${record.system_user.last_name}`;
    }
    if (record.visitor) {
      return `${record.visitor.first_name} ${record.visitor.last_name}`;
    }
    return record.user_id;
  };

  const getPersonType = (record: AttendanceRecord) => {
    if (record.system_user) {
      return record.system_user.role;
    }
    if (record.visitor) {
      return "visitor";
    }
    return "unknown";
  };

  const getContactInfo = (record: AttendanceRecord) => {
    if (record.system_user) {
      return record.system_user.email || "-";
    }
    if (record.visitor) {
      return record.visitor.phone_number || "-";
    }
    return "-";
  };

  const getOrganization = (record: AttendanceRecord) => {
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
        {/* Debug info section */}
        <div className="mb-3">
          <button
            className="text-xs text-gray-500 underline mb-1"
            onClick={() => setShowDebug((v) => !v)}
            type="button"
          >
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>
          {showDebug && (
            <div className="bg-gray-100 border rounded p-3 mb-2 text-xs max-w-full overflow-x-auto">
              <div>
                <strong>Supabase User:</strong>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUser, null, 2)}</pre>
              </div>
              <div>
                <strong>Supabase User Error:</strong>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.supabaseUserError, null, 2)}</pre>
              </div>
              <div>
                <strong>System User (system_users row):</strong>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.systemUser, null, 2)}</pre>
              </div>
              <div>
                <strong>Admin Role Assignments:</strong>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo?.adminRoleAssignments, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

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
