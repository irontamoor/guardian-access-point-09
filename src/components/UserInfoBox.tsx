
import React from "react";

interface UserInfoBoxProps {
  name?: string | null;
  email?: string | null;
  roles: string[];
  isLoading?: boolean;
}

export const UserInfoBox: React.FC<UserInfoBoxProps> = ({
  name,
  email,
  roles,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="absolute top-2 right-4 z-20 flex items-center gap-5 bg-white/70 rounded-md px-4 py-2 shadow border border-blue-100">
        <span className="animate-pulse text-gray-400">Loading user info…</span>
      </div>
    );
  }
  if (!email && !name) return null;

  return (
    <div className="absolute top-2 right-4 z-20 flex items-center gap-5 bg-white/80 rounded-md px-4 py-2 shadow border border-blue-100 min-w-[220px]">
      <div>
        <div className="font-medium text-gray-900 truncate">
          {name?.trim() || email}
        </div>
        <div className="text-xs text-gray-600 truncate">
          {email}
        </div>
      </div>
      <div>
        <div className="text-xs text-blue-600 font-semibold flex flex-wrap gap-x-2">
          {roles.length > 0 ? (
            roles.map((r) => (
              <span
                key={r}
                className="inline-block bg-blue-50 border border-blue-200 rounded px-2 py-0.5 mr-1"
              >
                {r}
              </span>
            ))
          ) : (
            <span className="text-gray-400">No roles assigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoBox;
