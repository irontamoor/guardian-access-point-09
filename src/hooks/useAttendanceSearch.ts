
import { useState, useCallback, useMemo } from 'react';
import type { SearchFilters } from '@/components/AttendanceSearch';

// Helper function to determine form type based on record data
const getRecordFormType = (record: any): string => {
  // Parent Pickup/Drop-off form
  if (record.organization === 'Parent Pickup/Dropoff' || 
      (record.visit_purpose && record.visit_purpose.includes('pickup'))) {
    return 'parent-pickup';
  }
  
  // Check if it's a system user (staff, student, admin)
  if (record.system_users) {
    if (record.system_users.role === 'staff' || record.system_users.role === 'admin') {
      return 'staff-signin';
    }
    if (record.system_users.role === 'student') {
      return 'student-signin';
    }
  }
  
  // Visitor registration (has visitor data but not pickup)
  if (record.organization || record.visit_purpose || record.phone_number) {
    return 'visitor-registration';
  }
  
  return 'unknown';
};

export function useAttendanceSearch(attendanceRecords: any[]) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const filteredRecords = useMemo(() => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return [];
    }

    return attendanceRecords.filter((record) => {
      // Search query filter (name, ID, notes)
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const user = record.system_users || {};
        const visitor = record.visitor;
        
        const name = user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}`.toLowerCase()
          : visitor 
          ? `${visitor.first_name} ${visitor.last_name}`.toLowerCase()
          : '';
        
        const userId = (user.user_code || user.id || record.user_id || '').toString().toLowerCase();
        const notes = (record.notes || '').toLowerCase();
        
        const matchesQuery = 
          name.includes(query) ||
          userId.includes(query) ||
          notes.includes(query);
          
        if (!matchesQuery) return false;
      }

      // Status filter
      if (searchFilters.status && record.status !== searchFilters.status) {
        return false;
      }

      // Form type filter
      if (searchFilters.formType) {
        const formType = getRecordFormType(record);
        if (formType !== searchFilters.formType) {
          return false;
        }
      }

      // Date range filter
      if (searchFilters.dateFrom) {
        const recordDate = new Date(record.created_at).toISOString().split('T')[0];
        if (recordDate < searchFilters.dateFrom) return false;
      }

      if (searchFilters.dateTo) {
        const recordDate = new Date(record.created_at).toISOString().split('T')[0];
        if (recordDate > searchFilters.dateTo) return false;
      }

      return true;
    });
  }, [attendanceRecords, searchFilters]);

  const handleSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
  }, []);

  return {
    filteredRecords,
    searchFilters,
    handleSearch,
    handleClearSearch,
    hasActiveFilters: Object.keys(searchFilters).some(key => 
      searchFilters[key as keyof SearchFilters] !== undefined && 
      searchFilters[key as keyof SearchFilters] !== ''
    ),
    getRecordFormType,
  };
}
