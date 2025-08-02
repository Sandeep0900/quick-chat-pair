import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  SkipForward,
  Settings
} from 'lucide-react';

interface VideoChatProps {
  onNext: () => void;
  onEndCall: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const VideoChat: React.FC<VideoChatProps> = ({
  onNext,
  onEndCall,
  isConnected,
  isConnecting
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    startLocalVideo();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Waiting for connection...';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'status-connecting';
    if (isConnected) return 'status-online';
    return 'status-offline';
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Status Bar */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative video-container rounded-xl overflow-hidden">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Placeholder when no remote video */}
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">
                {isConnecting ? 'Finding someone to chat with...' : 'Click "Start Chat" to begin'}
              </p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-card border border-border/50">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-card/50 backdrop-blur-sm border-t border-border/50">
        <div className="flex items-center justify-center gap-4">
          {/* Video Toggle */}
          <Button
            variant="control"
            size="control"
            onClick={toggleVideo}
            className={!isVideoEnabled ? 'bg-destructive text-destructive-foreground' : ''}
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>

          {/* Audio Toggle */}
          <Button
            variant="control"
            size="control"
            onClick={toggleAudio}
            className={!isAudioEnabled ? 'bg-destructive text-destructive-foreground' : ''}
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>

          {/* End Call */}
          <Button
            variant="endCall"
            size="control"
            onClick={onEndCall}
          >
            <PhoneOff />
          </Button>

          {/* Next Person */}
          <Button
            variant="next"
            size="control"
            onClick={onNext}
            disabled={!isConnected}
          >
            <SkipForward />
          </Button>

          {/* Settings */}
          <Button
            variant="control"
            size="control"
          >
            <Settings />
          </Button>
        </div>
      </div>
    </div>
  );
};