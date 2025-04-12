
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
      <div className="webcam-container w-full max-w-2xl bg-white border-4 border-white rounded-xl">
        <video 
          ref={videoRef} 
          className={`rounded-lg ${webcamActive ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
        />
        
        {!webcamActive && !loading && (
          <div className="webcam-overlay">
            <div className="text-center p-6">
              <div className="bg-game-secondary inline-block p-4 rounded-full mb-4">
                <CameraOff className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Camera is off</h3>
              <Button 
                onClick={startWebcam}
                className="bg-game-green hover:bg-game-green/90 text-white font-bold py-2 px-6 rounded-lg text-lg"
              >
                <Camera className="mr-2 h-6 w-6" />
                Start Camera
              </Button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="webcam-overlay">
            <div className="text-center">
              <Loader2 className="animate-spin h-16 w-16 mb-4 mx-auto text-game-green" />
              <p className="text-xl">Connecting to camera...</p>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'playing' && (
          <div className="absolute top-4 right-4 bg-white text-game-primary font-bold text-2xl rounded-full h-16 w-16 flex items-center justify-center border-4 border-game-primary">
            {timer}
          </div>
        )}
      </div>
      
      {webcamActive && (
        <Button 
          variant="outline" 
          onClick={stopWebcam}
          className="border-game-red text-game-red hover:bg-game-red/10 font-semibold"
        >
          <CameraOff className="mr-2 h-5 w-5" />
          Turn Off Camera
        </Button>
      )}
    </div>
  );
};

export default WebcamDisplay;
