
import { Shield, Clock } from 'lucide-react';

interface HomeHeaderProps {
  currentTime: Date;
}

export function HomeHeader({ currentTime }: HomeHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jamia Al-Hudaa</h1>
              <p className="text-sm text-gray-500">Visitor Management System</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
              <Clock className="h-5 w-5" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
