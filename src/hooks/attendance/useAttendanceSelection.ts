
import { useState, useCallback } from 'react';

// Generic record type for selection
type SelectableRecord = { id: string };

export function useAttendanceSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean, records: SelectableRecord[]) => {
    if (checked) {
      setSelectedIds(new Set(records.map(r => r.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    handleToggleSelect,
    handleSelectAll,
    clearSelection,
  };
}
