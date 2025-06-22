'use client';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertTriangle,
  Brain,
  Heart,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { vapi } from '@/lib/vapi';
import { msClient } from '@/lib/millis';

export default function AiSession() {
  // const [transcript, setTranscript] = useState<
  //   Array<{ role: string; text: string }>
  // >([]);

  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [therapistSpeaking, setTherapistSpeaking] = useState(false);
  const [clientSpeaking, setClientSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // useEffect(() => {
  //   vapi
  //     .on('call-start', () => {
  //       console.log('Call started');
  //       setIsCallActive(true);
  //     })
  //     .on('call-end', () => {
  //       console.log('Call ended');
  //       setIsCallActive(false);
  //       setTherapistSpeaking(false);
  //     })
  //     .on('speech-start', () => {
  //       console.log('Assistant started speaking');
  //       setTherapistSpeaking(true);
  //     })
  //     .on('speech-end', () => {
  //       console.log('Assistant stopped speaking');
  //       setTherapistSpeaking(false);
  //     })
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     .on('message', (message: any) => {
  //       if (message.type === 'transcript') {
  //         setTranscript((prev) => [
  //           ...prev,
  //           {
  //             role: message.role,
  //             text: message.transcript,
  //           },
  //         ]);
  //       }
  //     })
  //     .on('error', (error: Error) => {
  //       console.error('Vapi error:', error);
  //     });

  //   return () => vapi?.stop();
  // }, []);
  // useEffect(() => {
  //   msClient.on('onopen', () => {
  //     console.log('WebSocket connection opened.');
  //   });

  //   msClient.on('onready', () => {
  //     console.log('Client is ready.');
  //   });

  //   msClient.on('onsessionended', () => {
  //     console.log('Session ended.');
  //   });

  //   // msClient.on('onaudio', (audio) => {
  //   //   console.log('Audio received:', audio);
  //   // });

  //   msClient.on('onresponsetext', (text, payload) => {
  //     console.log('Response text:', text, 'Payload:', payload);
  //   });

  //   msClient.on('ontranscript', (text, payload) => {
  //     console.log('Transcript:', text, 'Payload:', payload);
  //   });

  //   msClient.on('analyzer', (analyzer) => {
  //     console.log('Analyzer node:', analyzer);
  //   });

  //   msClient.on('useraudioready', (data) => {
  //     console.log('User audio ready:', data);
  //   });

  //   msClient.on('onlatency', (latency) => {
  //     console.log('Latency:', latency);
  //   });

  //   msClient.on('onclose', (event) => {
  //     console.log('WebSocket connection closed:', event);
  //   });

  //   msClient.on('onerror', (error) => {
  //     console.error('WebSocket error:', error);
  //   });

  //   return () => {
  //     msClient.off("onerror")
  //     msClient.off("onerror")

  //     msClient.off("onerror")

  //     msClient.off("onerror")
  //     msClient.off("onerror")
  //     msClient.off("onerror")
  //     msClient.off("onerror")

  //   }
  // }, []);
  const handleStartCall = async () => {
    msClient.start({
      agent: {
        agent_id: '-OSX3OChFdUUmGj6Aj8R',
      },
      metadata: {
        name: 'Joshua',
      },
      include_metadata_in_prompt: true,
    });

    setIsCallActive(true);
    setSessionTime(0);
  };
  const handleEndCall = () => {
    msClient.stop();
    // if (vapi) {
    //   vapi.stop();
    // }
    setIsCallActive(false);
    setSessionTime(0);
    setTherapistSpeaking(false);
    setClientSpeaking(false);
  };

  return (
    <motion.div {...pageAnimations}>
      <div className="container mx-auto px-4 pb-8 pt-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            AI Voice Therapy Session
          </h1>
          <p className="text-gray-600">
            Connect with your AI mental health assistant through voice
          </p>
        </div>
      </div>
      <div className="mx-auto mb-8 max-w-4xl">
        <Card className="border-amber-200 bg-amber-50/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-700">
                <strong>Important:</strong> This AI assistant provides
                supportive conversations but is not a replacement for
                professional medical care. In case of emergency, contact 911 or
                the National Suicide Prevention Lifeline (988).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex items-center justify-center gap-4">
        <Badge
          variant={isCallActive ? 'default' : 'secondary'}
          className={cn(
            'px-4 py-2 text-sm font-medium',
            isCallActive
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-600'
          )}
        >
          {isCallActive ? 'Connected' : 'Disconnected'}
        </Badge>
        {isCallActive && (
          <Badge
            variant="outline"
            className="border-blue-200 px-4 py-2 text-sm font-medium text-blue-700"
          >
            Session: {formatTime(sessionTime)}
          </Badge>
        )}
      </div>

      <div className="mx-auto mb-12 grid max-w-4xl gap-8 md:grid-cols-2">
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              {therapistSpeaking && isCallActive && (
                <span className="absolute inset-0 z-0 flex items-center justify-center">
                  <span className="h-24 w-24 animate-ping rounded-full bg-blue-400/30"></span>
                </span>
              )}
              <div
                className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg transition-all duration-300 ${
                  therapistSpeaking && isCallActive
                    ? 'scale-105 ring-4 ring-blue-300 ring-opacity-75'
                    : ''
                }`}
              >
                <Brain size={48} />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              AI Therapist
            </h3>
            <p className="mb-4 text-gray-600">Mental Health Assistant</p>
            <Badge
              variant="secondary"
              className={`transition-all duration-300 ${
                therapistSpeaking && isCallActive
                  ? 'border-green-200 bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {therapistSpeaking && isCallActive ? 'Speaking...' : 'Listening'}
            </Badge>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div
                className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg transition-all duration-300 ${
                  clientSpeaking && isCallActive
                    ? 'scale-105 ring-4 ring-green-300 ring-opacity-75'
                    : ''
                }`}
              >
                <Heart size={48} />
              </div>
              {clientSpeaking && isCallActive && (
                <div className="absolute -right-2 -top-2">
                  <div className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
              )}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">You</h3>
            <p className="mb-4 text-gray-600">Client</p>
            <Badge
              variant="secondary"
              className={`transition-all duration-300 ${
                clientSpeaking && isCallActive
                  ? 'border-green-200 bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {clientSpeaking && isCallActive ? 'Speaking...' : 'Listening'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="my-4 flex flex-wrap items-center justify-center gap-4">
            {!isCallActive ? (
              <Button
                onClick={handleStartCall}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
              >
                <Phone className="mr-2" size={24} />
                Start AI Session
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                size="lg"
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-lg font-medium shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
              >
                <PhoneOff className="mr-2" size={24} />
                End Session
              </Button>
            )}
            {isCallActive && (
              <>
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant={isMuted ? 'destructive' : 'outline'}
                  size="lg"
                  className="px-6 py-6 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>

                <Button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  variant={isSpeakerOn ? 'default' : 'outline'}
                  size="lg"
                  className="px-6 py-6 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-6 shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <Settings size={20} />
                </Button>
              </>
            )}
          </div>

          {isCallActive && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full',
                      isMuted ? 'bg-red-400' : 'bg-green-400'
                    )}
                  ></div>
                  <span>{isMuted ? 'Microphone Off' : 'Microphone On'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full',
                      isSpeakerOn ? 'bg-green-400' : 'bg-gray-400'
                    )}
                  ></div>
                  <span>{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-blue-400"></div>
                  <span>Connected to AI</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
