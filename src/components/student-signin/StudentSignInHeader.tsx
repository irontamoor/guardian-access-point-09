
import { UserCheck } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function StudentSignInHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <UserCheck className="h-5 w-5 text-blue-600" />
        <span>Student Information</span>
      </CardTitle>
      <CardDescription>Enter student ID</CardDescription>
    </CardHeader>
  );
}
