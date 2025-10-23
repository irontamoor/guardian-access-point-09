import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePublicPickupData } from '@/hooks/usePublicPickupData';
import { ArrowLeft, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PublicPickupDashboardProps {
  onBack: () => void;
}

export function PublicPickupDashboard({ onBack }: PublicPickupDashboardProps) {
  const { records, isLoading, lastUpdated, refresh } = usePublicPickupData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onBack}
                  className="h-12 w-12"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-primary">🚗 Parent Pickup Status Board</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {format(lastUpdated, 'h:mm:ss a')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={refresh}
                className="h-12 w-12"
              >
                <RefreshCw className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Board */}
        {isLoading ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              Loading pickup records...
            </div>
          </Card>
        ) : records.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              No pickup records for today
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <Card
                key={record.id}
                className={`border-2 transition-all ${
                  record.approved
                    ? 'border-green-500 bg-green-50/50'
                    : 'border-red-500 bg-red-50/50'
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Student Info */}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Student ID
                    </div>
                    <div className="text-xl font-bold">{record.student_id}</div>
                  </div>

                  {record.student_name && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Student Name
                      </div>
                      <div className="text-lg font-semibold">{record.student_name}</div>
                    </div>
                  )}

                  {/* Parent Info */}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Parent/Guardian
                    </div>
                    <div className="text-lg font-semibold">
                      {record.parent_guardian_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ({record.relationship})
                    </div>
                  </div>

                  {/* Pickup Time */}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Pickup Time
                    </div>
                    <div className="text-base font-medium">
                      {format(new Date(record.action_time), 'h:mm a')}
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="pt-2 border-t">
                    {record.approved ? (
                      <Badge className="w-full justify-center py-2 text-base bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        APPROVED
                      </Badge>
                    ) : (
                      <Badge className="w-full justify-center py-2 text-base bg-red-600 hover:bg-red-700">
                        <Clock className="h-5 w-5 mr-2" />
                        PENDING APPROVAL
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
