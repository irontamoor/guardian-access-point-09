
import { useSystemUsersData } from "./users/useSystemUsersData";
import { parseStudent, parseStaff } from "./users/useUserParsers";

export { parseStudent, parseStaff };

export function useSystemUsers() {
  const { getUsersByRole } = useSystemUsersData();

  return { getUsersByRole, parseStudent, parseStaff };
}
