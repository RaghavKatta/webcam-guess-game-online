import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from './GameProvider';
import { Progress } from '@/components/ui/progress';
import { GAME_DURATION } from './GameProvider';
import { cn } from '@/lib/utils';
import ScoreDisplay from './ScoreDisplay';

const WebcamDisplay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    gameState,
    timer,
    currentWord,
    score
  } = useGame();

  const startWebcam = async () => {
    setLoading(true);
    setError(null);
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
      setError("Could not access your camera. Please check permissions and try again.");
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
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="webcam-container w-full bg-white border-4 border-white rounded-xl relative overflow-hidden h-[400px]">
        <video ref={videoRef} className={`w-full h-full object-cover rounded-lg ${webcamActive ? 'opacity-100' : 'opacity-0'}`} muted playsInline />
        
        {webcamActive && (
          <div className="absolute top-4 right-4 z-10">
            <ScoreDisplay />
          </div>
        )}
        
        {!webcamActive && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="bg-game-secondary inline-block p-4 rounded-full mb-4">
                <CameraOff className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Leonardo's Camera is Off</h3>
              <Button onClick={startWebcam} className="bg-game-green hover:bg-game-green/90 text-white font-bold py-2 px-6 rounded-lg text-lg">
                <Camera className="mr-2 h-6 w-6" />
                Start Camera
              </Button>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin h-16 w-16 mb-4 mx-auto text-game-green" />
              <p className="text-xl">Connecting to Leonardo's camera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="bg-red-100 inline-block p-4 rounded-full mb-4">
                <CameraOff className="h-16 w-16 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-500">Camera Error</h3>
              <p className="mb-4 text-gray-700">{error}</p>
              <Button onClick={startWebcam} className="bg-game-green hover:bg-game-green/90 text-white font-bold py-2 px-6 rounded-lg text-lg">
                <Camera className="mr-2 h-6 w-6" />
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'playing' && (
          <div className="absolute top-0 inset-x-0 p-4 flex justify-between">
            <div className="bg-white py-2 px-4 rounded-lg text-game-primary font-bold border-2 border-game-primary">
              Leonardo is Drawing: <span className="text-game-green">???</span>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'roundEnd' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="bg-white p-6 rounded-xl text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2 text-game-primary">Leonardo Finished Drawing!</h2>
              <p className="text-lg mb-4">Current Score: <span className="font-bold text-game-green">{score}</span></p>
              <p className="text-sm text-gray-600">Wait for Leonardo to start a new drawing or start a new round yourself</p>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'playing' && (
          <div className="absolute bottom-0 inset-x-0 p-4">
            <div className="bg-white/90 rounded-lg p-3 shadow-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Time Remaining:</span>
                <span className="font-bold text-xl text-game-primary">{timer}s</span>
              </div>
              <Progress value={timer / GAME_DURATION * 100} className={cn("h-4", timer <= 10 ? "bg-red-500" : "bg-game-green")} />
            </div>
          </div>
        )}
      </div>
      
      {webcamActive && (
        <Button variant="outline" onClick={stopWebcam} className="border-game-red text-game-red hover:bg-game-red/10 font-semibold">
          <CameraOff className="mr-2 h-5 w-5" />
          Turn Off Leonardo's Camera
        </Button>
      )}
    </div>
  );
};

export default WebcamDisplay;
