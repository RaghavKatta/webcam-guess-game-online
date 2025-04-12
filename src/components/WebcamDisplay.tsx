
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from './GameProvider';
import socketService from '@/services/socketService';
import { toast } from '@/hooks/use-toast';

interface WebcamDisplayProps {
  isStreamer?: boolean;
}

const WebcamDisplay: React.FC<WebcamDisplayProps> = ({ isStreamer = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { gameState, timer } = useGame();
  const [roomId, setRoomId] = useState<string | null>(null);

  const startWebcam = async () => {
    console.log('Starting webcam:', isStreamer ? 'as streamer' : 'as viewer');
    setLoading(true);
    
    try {
      if (isStreamer) {
        // For streamer: start broadcasting
        console.log('Starting streaming via socketService');
        await socketService.startStreaming();
        
        // Set up stream callback
        socketService.onStream((stream) => {
          console.log('Received stream from socketService');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              console.log('Video metadata loaded, playing video');
              videoRef.current?.play().catch(err => {
                console.error('Error playing video:', err);
              });
              setWebcamActive(true);
              setLoading(false);
            };
          }
        });
        
        // Set room ID for sharing
        const currentRoomId = socketService.getRoomId();
        if (currentRoomId) {
          setRoomId(currentRoomId);
          toast({
            title: "Stream started!",
            description: `Your stream ID is: ${currentRoomId}`,
          });
        }
      } else {
        // For viewer: just display remote stream
        socketService.onStream((stream) => {
          console.log('Viewer received stream');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(err => {
                console.error('Error playing video:', err);
              });
              setWebcamActive(true);
              setLoading(false);
            };
          }
        });
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopWebcam = () => {
    console.log('Stopping webcam');
    socketService.disconnect();
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
      setWebcamActive(false);
      setRoomId(null);
    }
  };

  // Join a specific room (for viewers)
  const joinRoom = (id: string) => {
    console.log('Joining room:', id);
    setLoading(true);
    socketService.joinRoom(id);
    toast({
      title: "Joining stream...",
      description: "Connecting to the streamer.",
    });
  };

  useEffect(() => {
    // Setup callbacks for connection status
    socketService.onConnected(() => {
      console.log('SocketService connected callback fired');
      toast({
        title: "Connected!",
        description: isStreamer ? "Viewers can now see your stream" : "You're now connected to the stream",
      });
    });

    socketService.onDisconnected(() => {
      console.log('SocketService disconnected callback fired');
      if (webcamActive) {
        toast({
          title: "Disconnected",
          description: "Connection to the stream was lost",
          variant: "destructive"
        });
        setWebcamActive(false);
      }
    });

    // Clean up on unmount
    return () => {
      stopWebcam();
    };
  }, [isStreamer, webcamActive]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="webcam-container w-full max-w-2xl bg-white border-4 border-white rounded-xl relative">
        <video 
          ref={videoRef} 
          className={`rounded-lg ${webcamActive ? 'opacity-100' : 'opacity-0'} object-contain w-full h-auto`}
          muted
          playsInline
        />
        
        {!webcamActive && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center p-6">
              <div className="bg-game-secondary inline-block p-4 rounded-full mb-4">
                <CameraOff className="h-16 w-16" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {isStreamer ? "Camera is off" : "Not connected to stream"}
              </h3>
              {isStreamer ? (
                <Button 
                  onClick={startWebcam}
                  className="bg-game-green hover:bg-game-green/90 text-white font-bold py-2 px-6 rounded-lg text-lg"
                >
                  <Camera className="mr-2 h-6 w-6" />
                  Start Camera
                </Button>
              ) : (
                <p className="text-gray-600 mb-4">Enter a stream ID to connect</p>
              )}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <Loader2 className="animate-spin h-16 w-16 mb-4 mx-auto text-game-green" />
              <p className="text-xl">
                {isStreamer ? "Connecting to camera..." : "Connecting to stream..."}
              </p>
            </div>
          </div>
        )}
        
        {webcamActive && gameState === 'playing' && (
          <div className="absolute top-4 right-4 bg-white text-game-primary font-bold text-2xl rounded-full h-16 w-16 flex items-center justify-center border-4 border-game-primary">
            {timer}
          </div>
        )}
      </div>
      
      {webcamActive ? (
        <Button 
          variant="outline" 
          onClick={stopWebcam}
          className="border-game-red text-game-red hover:bg-game-red/10 font-semibold"
        >
          <CameraOff className="mr-2 h-5 w-5" />
          {isStreamer ? "Stop Streaming" : "Disconnect"}
        </Button>
      ) : isStreamer ? null : (
        <div className="w-full max-w-md">
          <div className="join-stream-form bg-white p-4 rounded-xl">
            <input 
              type="text" 
              placeholder="Enter Stream ID"
              className="w-full p-2 border border-gray-300 rounded mb-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  joinRoom(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button 
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input && input.value) {
                  joinRoom(input.value);
                  input.value = '';
                }
              }}
              className="w-full bg-game-primary hover:bg-game-primary/90 text-white"
            >
              Join Stream
            </Button>
          </div>
        </div>
      )}

      {isStreamer && roomId && (
        <div className="mt-4 text-center p-4 bg-white rounded-xl w-full max-w-md">
          <p className="font-bold mb-2">Your Stream ID</p>
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <code className="text-sm text-gray-800">{roomId}</code>
            <Button 
              variant="ghost" 
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                toast({
                  title: "Copied!",
                  description: "Stream ID copied to clipboard",
                });
              }}
              className="ml-2 text-xs h-8"
            >
              Copy
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Share this ID with viewers so they can join your stream</p>
        </div>
      )}
    </div>
  );
};

export default WebcamDisplay;
