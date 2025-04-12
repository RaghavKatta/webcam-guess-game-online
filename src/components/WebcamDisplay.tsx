
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from './GameProvider';

const WebcamDisplay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { gameState, timer } = useGame();

  const startWebcam = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setWebcamActive(true);
          setLoading(false);
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setWebcamActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="webcam-container w-full max-w-2xl bg-white">
        <video 
          ref={videoRef} 
          className={`rounded-xl ${webcamActive ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
        />
        
        {!webcamActive && !loading && (
          <div className="webcam-overlay">
            <div className="text-center p-6">
              <CameraOff className="mx-auto h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold mb-4">Camera is off</h3>
              <Button 
                onClick={startWebcam}
                className="bg-game-primary hover:bg-game-primary/90"
              >
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="webcam-overlay">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 mb-4 mx-auto" />
              <p className="text-lg">Connecting to camera...</p>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'playing' && (
          <div className="absolute top-4 right-4 bg-game-primary text-white font-bold text-xl rounded-full h-14 w-14 flex items-center justify-center animate-pulse-light">
            {timer}
          </div>
        )}
      </div>
      
      {webcamActive && (
        <Button 
          variant="outline" 
          onClick={stopWebcam}
          className="border-red-300 text-red-500 hover:bg-red-50"
        >
          <CameraOff className="mr-2 h-4 w-4" />
          Turn Off Camera
        </Button>
      )}
    </div>
  );
};

export default WebcamDisplay;
