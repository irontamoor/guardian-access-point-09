import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Fingerprint, CheckCircle, XCircle, Loader2, Clock, User, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface FingerprintRecord {
  id: string;
  parent_guardian_name: string;
  relationship: string;
  is_approved: boolean;
  created_at: string;
  approved_at: string | null;
  student_ids: string[];
}

export function FingerprintApprovals() {
  const [records, setRecords] = useState<FingerprintRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      // Fetch fingerprints with their linked students
      const { data: fingerprints, error: fingerprintsError } = await supabase
        .from('parent_fingerprints')
        .select('id, parent_guardian_name, relationship, is_approved, created_at, approved_at')
        .order('created_at', { ascending: false });

      if (fingerprintsError) throw fingerprintsError;

      // Fetch all student links
      const { data: links, error: linksError } = await supabase
        .from('parent_student_links')
        .select('parent_fingerprint_id, student_id');

      if (linksError) throw linksError;

      // Combine data
      const recordsWithStudents = (fingerprints || []).map(fp => ({
        ...fp,
        student_ids: (links || [])
          .filter(l => l.parent_fingerprint_id === fp.id)
          .map(l => l.student_id)
      }));

      setRecords(recordsWithStudents);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch fingerprint records',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('parent_fingerprints')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Approved',
        description: 'Fingerprint registration has been approved.',
      });

      fetchRecords();
    } catch (error) {
      console.error('Approve error:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve registration',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      // Delete fingerprint (cascade will delete links)
      const { error } = await supabase
        .from('parent_fingerprints')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Rejected',
        description: 'Fingerprint registration has been rejected and removed.',
      });

      fetchRecords();
    } catch (error) {
      console.error('Reject error:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject registration',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRecords = records.filter(r => !r.is_approved);
  const approvedRecords = records.filter(r => r.is_approved);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Approvals
            {pendingRecords.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingRecords.length}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Review and approve fingerprint registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Fingerprint className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pending approvals</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {record.parent_guardian_name}
                      </div>
                    </TableCell>
                    <TableCell>{record.relationship}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {record.student_ids.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(record.id)}
                          disabled={processingId === record.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {processingId === record.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(record.id)}
                          disabled={processingId === record.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingId === record.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approved Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Approved Registrations
          </CardTitle>
          <CardDescription>
            All approved fingerprint registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Fingerprint className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No approved registrations yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {record.parent_guardian_name}
                      </div>
                    </TableCell>
                    <TableCell>{record.relationship}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {record.student_ids.join(', ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.approved_at 
                        ? format(new Date(record.approved_at), 'MMM d, yyyy h:mm a')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
