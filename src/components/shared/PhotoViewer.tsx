import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useState } from "react";

interface PhotoViewerProps {
  photoUrl: string | null;
  checkOutPhotoUrl?: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoViewer({ photoUrl, checkOutPhotoUrl, title, isOpen, onClose }: PhotoViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error('Download failed:', err));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          {photoUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Check-In Photo</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(photoUrl, 'check-in-photo.jpg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="relative bg-muted rounded-lg overflow-hidden">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                {error && (
                  <div className="p-8 text-center text-muted-foreground">
                    Failed to load photo
                  </div>
                )}
                <img
                  src={photoUrl}
                  alt="Check-in"
                  className="w-full h-auto"
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setLoading(false);
                    setError(true);
                  }}
                />
              </div>
            </div>
          )}

          {checkOutPhotoUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Check-Out Photo</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(checkOutPhotoUrl, 'check-out-photo.jpg')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="relative bg-muted rounded-lg overflow-hidden">
                <img
                  src={checkOutPhotoUrl}
                  alt="Check-out"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </div>

        <Button onClick={onClose} variant="outline" className="mt-4">
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
