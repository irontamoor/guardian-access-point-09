import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CameraCaptureProps {
  onCapture: (photoBlob: Blob) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CameraCapture({ onCapture, open, onOpenChange }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoDataUrl);
      stopCamera();
    }
  };

  const confirmPhoto = () => {
    if (!capturedPhoto) return;
    
    fetch(capturedPhoto)
      .then(res => res.blob())
      .then(blob => {
        onCapture(blob);
        handleClose();
      });
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
  };

  const handleClose = () => {
    setCapturedPhoto(null);
    stopCamera();
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && !capturedPhoto) {
      startCamera();
    }
    return () => stopCamera();
  }, [open, facingMode]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Capture Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error ? (
            <div className="text-destructive text-center p-4 bg-destructive/10 rounded-lg">
              {error}
            </div>
          ) : capturedPhoto ? (
            <div className="relative">
              <img src={capturedPhoto} alt="Captured" className="w-full rounded-lg" />
            </div>
          ) : (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {capturedPhoto ? (
              <>
                <Button onClick={retakePhoto} variant="outline">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Retake
                </Button>
                <Button onClick={confirmPhoto} className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </>
            ) : !error && (
              <>
                <Button onClick={switchCamera} variant="outline">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Switch
                </Button>
                <Button onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </>
            )}
            <Button onClick={handleClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}