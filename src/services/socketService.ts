
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';

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

  // Callbacks
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectedCallback: (() => void) | null = null;
  private onDisconnectedCallback: (() => void) | null = null;

  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket) return;
    
    this.socket = io(SOCKET_SERVER);
    
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
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

  // Create a new room as a streamer
  createRoom() {
    if (!this.socket) this.connect();
    this.socket?.emit('create-room');
  }

  // Join an existing room as a viewer
  joinRoom(roomId: string) {
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
        if (this.socket && this.roomId) {
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
}

// Singleton instance
const socketService = new SocketService();
export default socketService;
