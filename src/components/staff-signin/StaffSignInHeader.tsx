
import { Badge } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function StaffSignInHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Badge className="h-5 w-5 text-green-600" />
        <span>Employee Information</span>
      </CardTitle>
      <CardDescription>Enter your employee ID</CardDescription>
    </CardHeader>
  );
}
