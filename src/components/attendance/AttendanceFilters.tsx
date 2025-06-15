
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCcw, Clock } from 'lucide-react';

interface AttendanceFiltersProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  formatDate: (timestamp: string) => string;
}

export function AttendanceFilters({ 
  selectedDate, 
  onDateChange, 
  onRefresh, 
  isLoading,
  formatDate 
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-3">
        <Clock className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
      </div>
      <div className="flex items-center space-x-3">
        <Label htmlFor="date">Select Date:</Label>
        <Select value={selectedDate} onValueChange={onDateChange}>
          <SelectTrigger className="w-40" id="date">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value={new Date().toISOString().split('T')[0]}>
              Today ({formatDate(new Date().toISOString())})
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={onRefresh}
          disabled={isLoading}
          className="ml-2 flex gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
