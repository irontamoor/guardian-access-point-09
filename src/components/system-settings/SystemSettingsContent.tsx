
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SystemSettingsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No system settings configured yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Once settings are added, they'll appear here.</p>
      </CardContent>
    </Card>
  );
}
