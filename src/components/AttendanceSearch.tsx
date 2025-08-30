
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendanceSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  query?: string;
  status?: 'in' | 'out';
  formType?: 'staff-signin' | 'student-signin' | 'visitor-registration' | 'parent-pickup';
  dateFrom?: string;
  dateTo?: string;
}

export function AttendanceSearch({ onSearch, onClear }: AttendanceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [formType, setFormType] = useState<string>('staff-signin');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearch = () => {
    const filters: SearchFilters = {
      query: searchQuery.trim() || undefined,
      status: status === 'all' ? undefined : status as 'in' | 'out',
      formType: formType as 'staff-signin' | 'student-signin' | 'visitor-registration' | 'parent-pickup',
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };
    onSearch(filters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setStatus('all');
    setFormType('staff-signin');
    setDateFrom('');
    setDateTo('');
    onClear();
  };

  const handleTodayFilter = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateFrom(today);
    setDateTo(today);
    const filters: SearchFilters = {
      query: searchQuery.trim() || undefined,
      status: status === 'all' ? undefined : status as 'in' | 'out',
      formType: formType as 'staff-signin' | 'student-signin' | 'visitor-registration' | 'parent-pickup',
      dateFrom: today,
      dateTo: today,
    };
    onSearch(filters);
  };

  const hasFilters = searchQuery || status !== 'all' || formType !== 'staff-signin' || dateFrom || dateTo;

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, ID, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
        {hasFilters && (
          <Button onClick={handleClear} variant="outline" size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in">In</SelectItem>
              <SelectItem value="out">Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Form type dropdown removed - now handled by tabs */}

        <div>
          <Input
            type="date"
            placeholder="From Date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div>
          <Input
            type="date"
            placeholder="To Date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div>
          <Button onClick={handleTodayFilter} variant="outline" className="w-full">
            Today
          </Button>
        </div>
      </div>
    </div>
  );
}
