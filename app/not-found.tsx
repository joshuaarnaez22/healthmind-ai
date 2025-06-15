import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Phone, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Floating elements for visual interest */}
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-8 w-8 animate-pulse rounded-full bg-blue-200 opacity-60"></div>
          <div className="absolute -top-8 right-8 h-6 w-6 animate-pulse rounded-full bg-green-200 opacity-40 delay-1000"></div>
          <div className="absolute -right-2 top-4 h-4 w-4 animate-pulse rounded-full bg-purple-200 opacity-50 delay-500"></div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-green-100">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-800">
              Oops! Page Not Found
            </h1>
            <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-600">
              It looks like this page has wandered off. Thats okay – sometimes
              we all need to take a different path.
            </p>
          </div>

          {/* Supportive message */}
          <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    Youre not lost, just exploring
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Every journey has unexpected turns. Lets help you find your
                    way back to the resources and support youre looking for.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 px-8 text-white hover:bg-blue-700"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-300 px-8"
            >
              <Link href="/resources">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Resources
              </Link>
            </Button>
          </div>

          {/* Emergency support */}
          <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">
                  Need immediate support?
                  <Link
                    href="/crisis-support"
                    className="ml-1 font-medium text-green-600 hover:underline"
                  >
                    Crisis resources available 24/7
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Helpful links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="mb-4 text-sm text-gray-500">Popular sections:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/therapy" className="text-blue-600 hover:underline">
              Find a Therapist
            </Link>
            <Link href="/self-care" className="text-blue-600 hover:underline">
              Self-Care Tools
            </Link>
            <Link href="/community" className="text-blue-600 hover:underline">
              Community Support
            </Link>
            <Link href="/articles" className="text-blue-600 hover:underline">
              Wellness Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
