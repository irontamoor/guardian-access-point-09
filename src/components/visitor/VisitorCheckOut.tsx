import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogOut, Search, Camera, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';
import { SuccessBanner } from '@/components/ui/success-banner';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadPhoto } from '@/utils/photoUploadService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function VisitorCheckOut() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<Blob | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [customCheckoutTime, setCustomCheckoutTime] = useState<string>('');
  const { toast } = useToast();
  const { settings } = useSystemSettings();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter visitor name to search",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_records')
        .select('*')
        .eq('status', 'in')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .order('check_in_time', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSearchResults(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No visitors found",
          description: "No checked-in visitors match your search",
          variant: "default"
        });
      }
    } catch (error: any) {
      console.error('Error searching visitors:', error);
      toast({
        title: "Search Error",
        description: error.message || "Failed to search visitors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = async (photo: Blob) => {
    setCapturedPhoto(photo);
    setCameraOpen(false);
    if (selectedVisitor) {
      await handleCheckOut(selectedVisitor.id, selectedVisitor.name, photo);
    }
  };

  const handleCheckOutClick = (visitor: any) => {
    setSelectedVisitor({
      id: visitor.id,
      name: `${visitor.first_name} ${visitor.last_name}`,
      firstName: visitor.first_name,
      lastName: visitor.last_name
    });
    
    // Set default checkout time to now
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setCustomCheckoutTime(localDateTime);
    
    setCheckoutDialogOpen(true);
  };

  const handleProceedToCheckout = () => {
    setCheckoutDialogOpen(false);
    
    // Check if photo is required
    if (settings.photo_capture_settings.requireVisitorPhoto) {
      setCameraOpen(true);
    } else {
      // Check out without photo
      if (selectedVisitor) {
        handleCheckOut(selectedVisitor.id, selectedVisitor.name);
      }
    }
  };

  const handleCheckOut = async (visitorId: string, visitorName: string, photoBlob?: Blob) => {
    setCheckingOut(true);
    try {
      let photoUrl = null;
      const photoToUpload = photoBlob || capturedPhoto;
      if (photoToUpload && selectedVisitor) {
        photoUrl = await uploadPhoto(photoToUpload, 'visitors', selectedVisitor.firstName + selectedVisitor.lastName, 'check_out');
      }

      // Use custom checkout time or current time
      const checkoutTime = customCheckoutTime 
        ? new Date(customCheckoutTime).toISOString()
        : new Date().toISOString();

      const { error } = await supabase
        .from('visitor_records')
        .update({
          status: 'out',
          check_out_time: checkoutTime,
          check_out_photo_url: photoUrl
        })
        .eq('id', visitorId);

      if (error) throw error;

      const successMsg = `${visitorName} has been successfully checked out`;
      setSuccessMessage(successMsg);
      setShowSuccess(true);

      toast({
        title: "Check Out Successful",
        description: successMsg,
        variant: "default"
      });

      // Remove from search results
      setSearchResults(prev => prev.filter(v => v.id !== visitorId));
      setCapturedPhoto(null);
      setSelectedVisitor(null);
      setCustomCheckoutTime('');
    } catch (error: any) {
      console.error('Error checking out visitor:', error);
      toast({
        title: "Check Out Error",
        description: error.message || "Failed to check out visitor",
        variant: "destructive"
      });
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      <SuccessBanner
        show={showSuccess}
        message="Visitor Checked Out!"
        details={successMessage}
        onDismiss={() => setShowSuccess(false)}
      />
      <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <LogOut className="h-5 w-5 text-orange-600" />
          <span>Visitor Check Out</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="search">Search Visitor</Label>
            <Input
              id="search"
              placeholder="Enter visitor name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />
          </div>
          <div className="pt-8">
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2 mt-4">
            <Label>Checked-In Visitors</Label>
            <div className="space-y-2">
              {searchResults.map((visitor) => (
                <div 
                  key={visitor.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-semibold">
                      {visitor.first_name} {visitor.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {visitor.organization && `${visitor.organization} • `}
                      Visiting: {visitor.host_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Checked in: {new Date(visitor.check_in_time).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckOutClick(visitor)}
                    disabled={checkingOut}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>

      <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out: {selectedVisitor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Checkout Time
              </Label>
              <Input
                id="checkout-time"
                type="datetime-local"
                value={customCheckoutTime}
                onChange={(e) => setCustomCheckoutTime(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the time if checking out retroactively
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {settings.photo_capture_settings.requireVisitorPhoto ? (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Photo & Check Out
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Check Out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CameraCapture
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCameraCapture}
        autoCapture={true}
        autoCaptureDelay={3000}
      />
    </>
  );
}
