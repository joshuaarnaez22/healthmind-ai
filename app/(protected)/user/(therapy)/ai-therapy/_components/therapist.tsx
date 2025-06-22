'use client';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mic, Brain, Heart, Shield, AlertTriangle } from 'lucide-react';

export default function Therapist() {
  return (
    <motion.div {...pageAnimations}>
      <div className="container mx-auto px-4 pb-8 pt-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-800">
            AI Mental Health Voice Assistant
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Connect with our AI-powered mental health assistant through secure
            voice conversations. Experience personalized support and guidance
            from the comfort of your home.
          </p>
          <Link href="/admin/ai-therapy/session">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-6 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-green-600 hover:shadow-xl"
            >
              <Mic className="mr-2" size={24} />
              Start Voice Session
            </Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto mb-16 max-w-4xl">
        <Card className="border-2 border-amber-200 bg-amber-50/80 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="mt-1 h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-amber-800">
                  Important Professional Notice
                </h3>
                <p className="text-sm leading-relaxed text-amber-700">
                  This AI assistant is designed to provide supportive
                  conversations and general mental health information. It is{' '}
                  <strong>
                    not a replacement for professional medical advice,
                    diagnosis, or treatment
                  </strong>
                  . If you are experiencing a mental health crisis, thoughts of
                  self-harm, or need immediate assistance, please contact
                  emergency services (911), the National Suicide Prevention
                  Lifeline (988), or consult with a licensed mental health
                  professional immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-16 grid gap-8 md:grid-cols-3">
        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
              <Brain size={32} />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              AI-Powered Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-gray-600">
              Advanced AI technology trained on therapeutic approaches to
              provide empathetic, personalized mental health support and
              guidance.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
              <Heart size={32} />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              24/7 Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-gray-600">
              Access supportive conversations anytime you need them. Our AI
              assistant is available around the clock to provide guidance and
              support.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white">
              <Shield size={32} />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Secure & Private
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center text-gray-600">
              Your conversations are protected with end-to-end encryption,
              strict privacy protocols, and HIPAA compliance to ensure your
              personal health information stays safe and secure.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">How It Works</h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              1
            </div>
            <h3 className="mb-2 font-semibold text-gray-800">Connect</h3>
            <p className="text-sm text-gray-600">
              Start a secure voice session with our AI mental health assistant
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              2
            </div>
            <h3 className="mb-2 font-semibold text-gray-800">Talk</h3>
            <p className="text-sm text-gray-600">
              Engage in meaningful conversation with AI-powered therapeutic
              guidance
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              3
            </div>
            <h3 className="mb-2 font-semibold text-gray-800">Grow</h3>
            <p className="text-sm text-gray-600">
              Develop coping strategies and improve your mental wellbeing with
              AI support
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
