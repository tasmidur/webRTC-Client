import { Injectable } from '@angular/core';
import {
  UserAgent,
  Invitation,
  Inviter,
  Registerer,
  UserAgentOptions,
  SessionState,
  SessionDescriptionHandlerOptions,
  RegistererState
} from 'sip.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SipService {

  public dummyUsers = [
    { email: '1001@jazzware.com', username: '1001', password: '1001' },
    { email: '1002@jazzware.com', username: '1002', password: '1002' },
    { email: '1003@jazzware.com', username: '1003', password: '1003' },
    { email: '1004@jazzware.com', username: '1004', password: '1004' },
    { email: '1005@jazzware.com', username: '1005', password: '1005' },
    { email: '1006@jazzware.com', username: '1006', password: '1006' },
  ];

  private userAgent: UserAgent | null = null;
  public registerer: Registerer | null = null;
  private activeInviter: Inviter | null = null; // For outgoing calls
  private currentInvitation: Invitation | null = null; // For incoming calls

  private sipDomain = '192.168.1.150';
  private transportOptions = {
    server: 'wss://192.168.1.150:7443',
  };
  private storageKey = 'sipCredentials';

  private maxReconnectAttempts = 5; // Maximum retry attempts
private maxReconnectDelay = 10000; // Maximum delay (in ms) between retries
private reconnectAttempts = 0; // Counter for reconnect attempts

  private localMediaStream: MediaStream | null = null;
  private remoteMediaStream: MediaStream | null = null;

  // Observable Subjects
  private connectionStatusSubject = new BehaviorSubject<string>('disconnected');
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  private callStatusSubject = new BehaviorSubject<'idle' | 'incoming' | 'outgoing' | 'connected' | 'connecting' | 'ended' | 'ringing'>('idle');
  callStatus$ = this.callStatusSubject.asObservable();

  constructor() {}

  // Getters
  getSipAddress(): string {
    return this.sipDomain;
  }

  getUserAgent(): UserAgent {
    if (!this.userAgent) throw new Error('UserAgent is not initialized.');
    return this.userAgent;
  }

  // Initialize the UserAgent
  initialize(username: string, password: string): void {
    if (this.userAgent) {
      console.warn('UserAgent is already initialized.');
      return;
    }
  
    const uri = UserAgent.makeURI(`sip:${username}@${this.sipDomain}`);
    if (!uri) throw new Error(`Invalid URI: sip:${username}@${this.sipDomain}`);
  
    const userAgentOptions: UserAgentOptions = {
      uri,
      authorizationUsername: username,
      authorizationPassword: password,
      transportOptions: this.transportOptions,
      logLevel: 'debug',
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        },
      },
    };
  
    this.userAgent = new UserAgent(userAgentOptions);
    this.attachTransportListeners();
    this.attachDelegate();
    this.saveCredentials(username, password);
    console.log('UserAgent initialized with username:', username);
  }

  async register(username: string, password: string): Promise<void> {
    try {
      this.initialize(username, password);
  
      if (this.userAgent) {
        await this.userAgent.start();
        this.registerer = new Registerer(this.userAgent);
  
        // Check if already registered
        if (this.registerer.state === RegistererState.Registered) {
          console.log('SIP User is already registered.');
          return;
        }
  
        // Perform registration
        await this.registerer.register();
        console.log('SIP User successfully registered.');
        this.connectionStatusSubject.next('connected');
  
        // Observe state changes for unregistration
        this.registerer.stateChange?.on((newState) => {
          if (newState === RegistererState.Unregistered) {
            console.warn('SIP client unregistered. Attempting to re-register...');
            this.retryRegistration(username, password);
          }
        });
      } else {
        throw new Error('UserAgent is not initialized.');
      }
    } catch (error) {
      console.error('Failed to register:', error);
      this.connectionStatusSubject.next('disconnected');
      throw error;
    }
  }

  private async retryRegistration(username: string, password: string): Promise<void> {
    const retryInterval = 60000;
  
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(async () => {
        try {
          console.log(`Re-registration attempt #${this.reconnectAttempts + 1}`);
          this.reconnectAttempts++;
          await this.register(username, password);
          console.log('Re-registration successful.');
          this.reconnectAttempts = 0; // Reset attempts on success
        } catch (error) {
          console.error('Re-registration failed:', error);
          this.retryRegistration(username, password); // Recursive retry
        }
      }, retryInterval);
    } else {
      console.error('Max re-registration attempts reached.');
      this.connectionStatusSubject.next('disconnected');
    }
  }

  // Attach transport event listeners
  private attachTransportListeners(): void {
    if (!this.userAgent) throw new Error('UserAgent is not initialized');

    this.userAgent.transport.onConnect = () => {
      console.log('WebSocket connected.');
      this.connectionStatusSubject.next('connected');
    };

    this.userAgent.transport.onDisconnect = (error) => {
      console.log('WebSocket disconnected.', error || '');
      this.connectionStatusSubject.next('disconnected');
    };
  }

  getCurrentCallStatus(): 'incoming' | 'outgoing' | 'connected' | 'ended' | 'idle' {
    // Check for incoming call
    if (this.currentInvitation && this.currentInvitation.state === SessionState.Initial) {
      return 'incoming';
    }

    // Check for outgoing call
    if (this.activeInviter && this.activeInviter.state === SessionState.Establishing) {
      return 'outgoing';
    }

    // Check if a call is connected
    if (
      (this.currentInvitation && this.currentInvitation.state === SessionState.Established) ||
      (this.activeInviter && this.activeInviter.state === SessionState.Established)
    ) {
      return 'connected';
    }

    // Check if the call has ended
    if (
      (this.currentInvitation && this.currentInvitation.state === SessionState.Terminated) ||
      (this.activeInviter && this.activeInviter.state === SessionState.Terminated)
    ) {
      return 'ended';
    }

    // Default to idle state
    return 'idle';
  }

  // Attach delegate to handle incoming calls
  private attachDelegate(): void {
    if (!this.userAgent) {
      console.error('UserAgent is not initialized.');
      return;
    }
  
    this.userAgent.delegate = {
      onInvite: (invitation) => {
        console.log('Incoming call invitation received.');
        this.handleIncomingCall(invitation);
  
        // Attach state listener to handle session state changes
        invitation.stateChange.addListener((state) => {
          switch (state) {
            case SessionState.Established:
              console.log('Call is connected.');
              this.callStatusSubject.next('connected');
              break;
  
            case SessionState.Terminated:
              console.log('Call has been ended by the other end.');
              this.callStatusSubject.next('ended');
              this.cleanupSession();
              break;
  
            case SessionState.Initial:
            case SessionState.Establishing:
              console.log('Call is dialing or ringing.');
              break;
  
            default:
              console.warn(`Unhandled session state: ${state}`);
          }
        });
      },
    };
  }

  getLocalMediaStream(): MediaStream | null {
    return this.localMediaStream;
  }
  
  // Get the remote media stream
  getRemoteMediaStream(): MediaStream | null {
    return this.remoteMediaStream;
  }

  getRemotePhoneNumber(): string | null {
    if (this.currentInvitation) {
      const fromHeader = this.currentInvitation.request.from?.uri?.aor; // Access the URI's AOR (Address of Record)
      if (fromHeader) {
        const match = fromHeader.match(/sip:(.*?)@/); // Regex to extract the phone number
        if (match && match[1]) {
          return match[1]; // Return the extracted phone number
        }
      }
    }
  
    console.warn('No active incoming call or remote phone number unavailable.');
    return null;
  }
  
  
  // Attach media streams during a call
  private attachMediaToSession(session: any): void {
    const sessionDescriptionHandler = session.sessionDescriptionHandler;
  
    if (!sessionDescriptionHandler) {
      console.error('No session description handler available.');
      return;
    }
  
    // Extract media streams
    this.localMediaStream = sessionDescriptionHandler.localMediaStream;
    this.remoteMediaStream = sessionDescriptionHandler.remoteMediaStream;
  
    console.log('Media streams attached.');
  }

  // Handle incoming calls
  handleIncomingCall(invitation: Invitation): void {
    console.log('Incoming call received.');
    this.currentInvitation = invitation;
    this.callStatusSubject.next('incoming');
  }

  // Accept an incoming call
  async acceptIncomingCall(): Promise<void> {
    if (!this.currentInvitation) {
      console.error('No incoming call to accept.');
      return;
    }
  
    try {
      console.log('Accepting the incoming call...');
      await this.currentInvitation.accept({
        sessionDescriptionHandlerOptions: this.getMediaConstraints(), // Apply media constraints
      });
  
      // Attach media streams after accepting the call
      this.attachMediaToSession(this.currentInvitation);
  
      // Update call status
      this.callStatusSubject.next('connected');
      console.log('Incoming call successfully accepted.');
    } catch (error) {
      console.error('Failed to accept the incoming call:', error);
      this.callStatusSubject.next('ended'); // Set to ended if something goes wrong
    }
  }

  // Reject an incoming call
  async rejectIncomingCall(): Promise<void> {
    if (!this.currentInvitation) {
      console.error('No incoming call to reject.');
      return;
    }

    try {
      console.log('Rejecting incoming call...');
      await this.currentInvitation.reject();
      this.callStatusSubject.next('idle');
      console.log('Incoming call rejected.');
    } catch (error) {
      console.error('Failed to reject incoming call:', error);
    } finally {
      this.currentInvitation = null;
    }
  }

  updateVideoState(isVideoEnabled: boolean): void {
    if (!this.userAgent) {
      console.error('UserAgent is not initialized.');
      return;
    }
  
    if (!this.localMediaStream) {
      console.error('No local media stream found.');
      return;
    }
  
    console.log(isVideoEnabled ? 'Enabling video...' : 'Disabling video...');
  
    // Find the video tracks in the local media stream
    const videoTracks = this.localMediaStream.getVideoTracks();
    if (videoTracks.length === 0) {
      console.warn('No video tracks found in local media stream.');
      return;
    }
  
    // Enable or disable the video tracks
    videoTracks.forEach((track) => {
      track.enabled = isVideoEnabled;
    });
  
    console.log(isVideoEnabled ? 'Video enabled.' : 'Video disabled.');
  }

  updateMuteState(isMuted: boolean): void {
    if (!this.userAgent) {
      console.error('UserAgent is not initialized.');
      return;
    }
  
    if (!this.localMediaStream) {
      console.error('No local media stream found.');
      return;
    }
  
    console.log(isMuted ? 'Muting microphone...' : 'Unmuting microphone...');
  
    // Find the audio tracks in the local media stream
    const audioTracks = this.localMediaStream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.warn('No audio tracks found in local media stream.');
      return;
    }
  
    // Mute or unmute the audio tracks
    audioTracks.forEach((track) => {
      track.enabled = !isMuted;
    });
  
    console.log(isMuted ? 'Microphone muted.' : 'Microphone unmuted.');
  }

  public makeOutgoingCall(target: string): void {
    const targetUri = UserAgent.makeURI(target);
  
    if (!this.userAgent) {
      console.error('UserAgent is not initialized.');
      return;
    }
  
    this.activeInviter = new Inviter(this.userAgent, targetUri!);
  
    this.activeInviter.stateChange.addListener((state) => {
      if (state === SessionState.Established) {
        console.log('Call connected.');
        this.callStatusSubject.next('connected');
      } else if (state === SessionState.Terminated) {
        console.log('Call ended.');
        this.callStatusSubject.next('ended');
        this.cleanupSession();
      }
    });
  
    this.activeInviter.invite().catch((error) => {
      console.error('Failed to initiate the call:', error);
    });
  }

  async terminateCall(): Promise<void> {
    try {
      const session = this.currentInvitation || this.activeInviter;
  
      if (!session) {
        console.warn('No active session to terminate.');
        return;
      }
  
      console.log(`Terminating session. Current state: ${session.state}`);
  
      switch (session.state) {
        case SessionState.Initial:
        case SessionState.Establishing:
          if (session instanceof Inviter) {
            console.log('Canceling outgoing call...');
            await session.cancel();
          } else if (session instanceof Invitation) {
            console.log('Rejecting incoming call...');
            await session.reject();
          }
          break;
        case SessionState.Established:
          console.log('Sending BYE to terminate the established call...');
          await session.bye();
          break;
        case SessionState.Terminating:
        case SessionState.Terminated:
          console.warn('Session is already terminating or terminated. No action required.');
          break;
        default:
          console.warn(`Unhandled session state: ${session.state}`);
      }
    } catch (error) {
      console.error('Failed to terminate the session:', error);
      throw error;
    } finally {
      this.cleanupSession();
    }
  }
  
  private cleanupSession(): void {
    console.log('Cleaning up session...');
    this.activeInviter = null;
    this.currentInvitation = null;
    this.cleanupMediaStreams();
    this.callStatusSubject.next('idle'); // Reset call status to idle
  }
  
  private cleanupMediaStreams(): void {
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach((track) => track.stop());
      this.localMediaStream = null;
    }
  
    if (this.remoteMediaStream) {
      this.remoteMediaStream.getTracks().forEach((track) => track.stop());
      this.remoteMediaStream = null;
    }
  
    console.log('Media streams cleaned up.');
  }
  

  // Get media constraints
  public getMediaConstraints(): SessionDescriptionHandlerOptions {
    return {
      constraints: {
        audio: true,
        video: false, // Change to true if video is needed
      },
    };
  }

  // Save credentials to localStorage
  private saveCredentials(username: string, password: string): void {
    localStorage.setItem(this.storageKey, JSON.stringify({ username, password }));
  }

  // Retrieve saved credentials
  private getStoredCredentials(): { username: string; password: string } | null {
    const credentials = localStorage.getItem(this.storageKey);
    return credentials ? JSON.parse(credentials) : null;
  }

  // Clear credentials
  private clearCredentials(): void {
    localStorage.removeItem(this.storageKey);
  }
}
