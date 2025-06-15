
import { useState, useCallback } from 'react';

export function useAttendanceFilters() {
  const [selectedDate, setSelectedDate] = useState('all');

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    handleDateChange,
  };
}
