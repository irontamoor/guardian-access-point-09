
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, UserCheck, UserPlus, Car } from 'lucide-react';

interface HomeActionCardsProps {
  visibility: any;
  visibilityLoading: boolean;
  onViewChange: (view: string) => void;
}

export function HomeActionCards({ visibility, visibilityLoading, onViewChange }: HomeActionCardsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {!visibilityLoading && visibility.showStudentCheckIn && (
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-blue-500"
            onClick={() => onViewChange('students')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Students</span>
              </div>
              <CardTitle className="text-xl text-gray-900">Student Check-In</CardTitle>
              <CardDescription>Quick and easy student arrival and departure tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In / Out
              </Button>
            </CardContent>
          </Card>
        )}

        {!visibilityLoading && visibility.showStaffSignIn && (
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-green-500"
            onClick={() => onViewChange('staff')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <UserCheck className="h-8 w-8 text-green-600" />
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Staff</span>
              </div>
              <CardTitle className="text-xl text-gray-900">Staff Sign-In</CardTitle>
              <CardDescription>Employee attendance and time tracking system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Sign In / Out
              </Button>
            </CardContent>
          </Card>
        )}

        {!visibilityLoading && visibility.showVisitorRegistration && (
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-purple-500"
            onClick={() => onViewChange('visitors')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <UserPlus className="h-8 w-8 text-purple-600" />
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Visitors</span>
              </div>
              <CardTitle className="text-xl text-gray-900">Visitor Registration</CardTitle>
              <CardDescription>Secure visitor check-in with badge printing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Register Visitor
              </Button>
            </CardContent>
          </Card>
        )}

        {!visibilityLoading && visibility.showParentPickup && (
          <Card 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border-l-4 border-l-orange-500"
            onClick={() => onViewChange('parents')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Car className="h-8 w-8 text-orange-600" />
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Parents</span>
              </div>
              <CardTitle className="text-xl text-gray-900">Parent Pickup</CardTitle>
              <CardDescription>Safe child pickup and drop-off management</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                Pickup / Drop-off
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
