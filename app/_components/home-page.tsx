'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Apple } from 'lucide-react';
import { motion } from 'motion/react';
import { ModeToggle } from '@/components/dark-mode';
import FeatureCard from './feature-card';
import MobileNav from './mobile-nav';
import ChatPanel from './chat-panel';
import Link from 'next/link';
import { Testimonial } from './testimonial';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="scrollbar flex h-screen flex-col overflow-y-scroll bg-gradient-to-br from-gray-50 to-white transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              HealthMind
            </span>
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <Button
              variant="ghost"
              className="font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Features
            </Button>

            <Button
              variant="ghost"
              className="font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="font-semibold text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Terms and Services
            </Button>
            <Link href="/sign-in">
              <Button className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                Sign In
              </Button>
            </Link>

            <ModeToggle />
          </div>
        </nav>
      </header>

      <main className="container mx-auto grid grid-flow-row px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20 text-center"
        >
          <h1 className="mb-6 text-3xl font-extrabold text-gray-800 dark:text-white md:text-6xl">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
            Track, improve, and celebrate your health journey with HealthMind
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            Start Your Journey
          </Button>
        </motion.section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20 grid gap-8 md:grid-cols-3"
        >
          <FeatureCard
            icon={<Activity className="h-12 w-12 text-purple-500" />}
            title="Smart Tracking"
            description="AI-powered activity and health metrics monitoring"
          />
          <FeatureCard
            icon={<Apple className="h-12 w-12 text-green-500" />}
            title="Nutrition AI"
            description="Personalized meal plans and nutritional insights"
          />
          <FeatureCard
            icon={<Heart className="h-12 w-12 text-red-500" />}
            title="Holistic Wellness"
            description="Mental health tracking and mindfulness exercises"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="my-20"
        >
          <motion.h2
            className="mb-16 text-center text-4xl font-bold text-gray-800 dark:text-white md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Transforming Lives
          </motion.h2>
          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Testimonial
              quote="HealthMind has completely changed my approach to wellness. The personalized insights are incredible!"
              author="Sarah J."
              role="Fitness Enthusiast"
            />
            <Testimonial
              quote="As a busy professional, HealthMind helps me stay on top of my health goals effortlessly."
              author="Michael R."
              role="Tech Executive"
            />
            <Testimonial
              quote="The mental wellness features have been a game-changer for my overall health and productivity."
              author="Emily L."
              role="Yoga Instructor"
            />
          </div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/sign-in">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </motion.section>
      </main>
      <main></main>
      <footer className="mt-auto bg-gray-100 py-8 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 HealthMind. Empowering your wellness journey.</p>
        </div>
      </footer>

      <ChatPanel isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
