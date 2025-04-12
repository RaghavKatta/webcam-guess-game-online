import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { toast } from '@/hooks/use-toast';

// For development, we'll use a free Socket.io server
// In production, you should use your own server
const SOCKET_SERVER = 'https://webcam-guess-server.glitch.me';

class SocketService {
  private socket: Socket | null = null;
  private peer: Peer.Instance | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private roomId: string | null = null;
  private isInitiator = false;
  private mockMode = false;
  private connectionRetries = 0;
  private maxRetries = 2;

  // Callbacks
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectedCallback: (() => void) | null = null;
  private onDisconnectedCallback: (() => void) | null = null;

  constructor() {
    // Check if we've had CORS issues in the past based on localStorage
    const hasPreviousCorsIssues = localStorage.getItem('webcam-cors-issues') === 'true';
    
    if (hasPreviousCorsIssues) {
      console.log('Previous CORS issues detected, starting in mock mode');
      this.mockMode = true;
    } else {
      this.connect();
    }
  }

  connect() {
    if (this.socket || this.mockMode) return;
    
    try {
      console.log('Attempting to connect to signaling server...');
      
      // Create socket connection with error handling
      this.socket = io(SOCKET_SERVER, {
        reconnectionAttempts: this.maxRetries,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });
      
      this.setupSocketEventHandlers();
      
      // Set a timeout to check if connection was successful
      setTimeout(() => {
        if (!this.socket?.connected) {
          console.warn('Socket connection failed, switching to mock mode');
          this.enableMockMode(true);
        }
      }, 5000);
    } catch (error) {
      console.error('Error creating socket connection:', error);
      this.enableMockMode(true);
    }
  }

  private setupSocketEventHandlers() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
      // Reset localStorage flag on successful connection
      localStorage.removeItem('webcam-cors-issues');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.connectionRetries++;
      
      if (this.connectionRetries >= this.maxRetries) {
        this.enableMockMode(true);
      }
    });

    this.socket.on('room-created', (roomId: string) => {
      this.roomId = roomId;
      console.log(`Room created: ${roomId}`);
      this.isInitiator = true;
    });

    this.socket.on('room-joined', (roomId: string) => {
      this.roomId = roomId;
      console.log(`Joined room: ${roomId}`);
      this.isInitiator = false;
      
      // When joining a room, we need to signal to the initiator
      if (this.socket) {
        this.socket.emit('ready', roomId);
      }
    });

    this.socket.on('ready', () => {
      console.log('Remote peer is ready');
      if (this.isInitiator && this.localStream) {
        this.initializePeer();
      }
    });

    this.socket.on('signal', (data: Peer.SignalData) => {
      console.log('Received signal');
      if (this.peer) {
        this.peer.signal(data);
      } else if (!this.isInitiator) {
        this.initializePeer();
        // A slight delay to make sure peer is initialized
        setTimeout(() => {
          if (this.peer) {
            this.peer.signal(data);
          }
        }, 100);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
      this.cleanupPeer();
      if (this.onDisconnectedCallback) {
        this.onDisconnectedCallback();
      }
    });
  }

  // Enable mock mode when CORS or connection issues occur
  private enableMockMode(persistFlag = false) {
    if (this.mockMode) return;
    
    console.log('Switching to mock mode due to connection issues');
    this.mockMode = true;
    
    // Store this decision in localStorage if needed
    if (persistFlag) {
      localStorage.setItem('webcam-cors-issues', 'true');
    }
    
    // Clean up any existing socket connection attempts
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    toast({
      title: "Connection Issue",
      description: "Using local mode due to connection problems",
      variant: "default"
    });
    
    // Generate a fake room ID
    this.roomId = 'local-' + Math.random().toString(36).substring(2, 7);
  }

  // Create a new room as a streamer
  createRoom() {
    if (this.mockMode) {
      console.log('Creating mock room:', this.roomId);
      this.isInitiator = true;
      return;
    }
    
    if (!this.socket) this.connect();
    this.socket?.emit('create-room');
  }

  // Join an existing room as a viewer
  joinRoom(roomId: string) {
    if (this.mockMode) {
      console.log('Joining mock room:', roomId);
      this.roomId = roomId;
      this.isInitiator = false;
      
      // Simulate connection success
      setTimeout(() => {
        if (this.onConnectedCallback) {
          this.onConnectedCallback();
        }
      }, 1000);
      return;
    }
    
    if (!this.socket) this.connect();
    this.socket?.emit('join-room', roomId);
  }

  // Start streaming (for streamers)
  async startStreaming() {
    try {
      console.log('Attempting to access webcam...');
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      console.log('Webcam access successful, creating room');
      this.createRoom();
      
      if (this.onStreamCallback) {
        console.log('Calling onStreamCallback with local stream');
        this.onStreamCallback(this.localStream);
      }
      
      return this.localStream;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      
      // In mock mode, create a canvas-based fake stream
      if (this.mockMode) {
        console.log('Creating mock stream');
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        
        // Draw something on the canvas
        if (ctx) {
          setInterval(() => {
            if (!ctx) return;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.fillText('Local Camera Mode', 20, 50);
            ctx.fillText('CORS issues prevented real connection', 20, 100);
            ctx.fillText('Current time: ' + new Date().toLocaleTimeString(), 20, 150);
          }, 1000);
        }
        
        // @ts-ignore - Canvas streams are supported but TypeScript doesn't know
        const stream = canvas.captureStream(30);
        this.localStream = stream;
        
        if (this.onStreamCallback) {
          this.onStreamCallback(stream);
        }
        
        return stream;
      }
      
      throw err;
    }
  }

  // Initialize peer connection
  private initializePeer() {
    console.log('Initializing peer connection, initiator:', this.isInitiator);
    
    try {
      const config = {
        initiator: this.isInitiator,
        stream: this.localStream || undefined,
        trickle: false,
      };

      this.peer = new Peer(config);

      this.peer.on('signal', (data) => {
        console.log('Generated signal data');
        if (this.socket && this.roomId && !this.mockMode) {
          this.socket.emit('signal', { roomId: this.roomId, signal: data });
        }
      });

      this.peer.on('connect', () => {
        console.log('Peer connection established');
        if (this.onConnectedCallback) {
          this.onConnectedCallback();
        }
      });

      this.peer.on('stream', (stream) => {
        console.log('Received remote stream');
        this.remoteStream = stream;
        if (this.onStreamCallback) {
          this.onStreamCallback(stream);
        }
      });

      this.peer.on('error', (err) => {
        console.error('Peer connection error:', err);
        this.cleanupPeer();
      });
    } catch (error) {
      console.error('Error creating peer:', error);
    }
  }

  // Clean up peer connection
  private cleanupPeer() {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }

  // Disconnect from everything
  disconnect() {
    this.cleanupPeer();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Don't reset mockMode here - we want to keep that setting
    // this.mockMode = false;
  }

  // Register callback for when remote stream is received
  onStream(callback: (stream: MediaStream) => void) {
    console.log('Registering onStream callback');
    this.onStreamCallback = callback;
    
    // If we already have a stream, call the callback immediately
    if (this.localStream && this.isInitiator) {
      console.log('Already have local stream, calling callback immediately');
      callback(this.localStream);
    } else if (this.remoteStream && !this.isInitiator) {
      console.log('Already have remote stream, calling callback immediately');
      callback(this.remoteStream);
    }
  }

  // Register callback for when connection is established
  onConnected(callback: () => void) {
    this.onConnectedCallback = callback;
  }

  // Register callback for when connection is lost
  onDisconnected(callback: () => void) {
    this.onDisconnectedCallback = callback;
  }
  
  // Get the current room ID (for sharing)
  getRoomId() {
    return this.roomId;
  }
  
  // Check if we're in mock mode
  isMockMode() {
    return this.mockMode;
  }
  
  // Reset mock mode (useful for testing)
  resetMockMode() {
    this.mockMode = false;
    localStorage.removeItem('webcam-cors-issues');
    console.log('Mock mode reset, will try server connection on next attempt');
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
