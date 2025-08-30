
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
  const [formType, setFormType] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearch = () => {
    const filters: SearchFilters = {
      query: searchQuery.trim() || undefined,
      status: status === 'all' ? undefined : status as 'in' | 'out',
      formType: formType === 'all' ? undefined : formType as 'staff-signin' | 'student-signin' | 'visitor-registration' | 'parent-pickup',
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    };
    onSearch(filters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setStatus('all');
    setFormType('all');
    setDateFrom('');
    setDateTo('');
    onClear();
  };

  const hasFilters = searchQuery || status !== 'all' || formType !== 'all' || dateFrom || dateTo;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div>
          <Select value={formType} onValueChange={setFormType}>
            <SelectTrigger>
              <SelectValue placeholder="All Forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              <SelectItem value="staff-signin">Staff Sign In</SelectItem>
              <SelectItem value="student-signin">Student Sign In</SelectItem>
              <SelectItem value="visitor-registration">Visitor Registration</SelectItem>
              <SelectItem value="parent-pickup">Parent Pickup & Drop-off</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
      </div>
    </div>
  );
}
