'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Apple } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModeToggle } from '@/components/dark-mode';
import FeatureCard from './feature-card';
import MobileNav from './mobile-nav';
import ChatPanel from './chat-panel';
import Link from 'next/link';
import { Testimonial } from './testimonial';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="h-screen overflow-y-scroll scrollbar flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
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
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-semibold"
            >
              Features
            </Button>

            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-semibold"
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white font-semibold"
            >
              Terms and Services
            </Button>
            <Link href="/sign-in">
              <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white">
                Sign In
              </Button>
            </Link>

            <ModeToggle />
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12 grid grid-flow-row ">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-20"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 text-gray-800 dark:text-white">
            Your Health,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Reimagined
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
            Track, improve, and celebrate your health journey with HealthMind
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Start Your Journey
          </Button>
        </motion.section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-20 "
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
            className="text-4xl md:text-6xl font-bold mb-16 text-center text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Transforming Lives
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </motion.section>
      </main>
      <main></main>
      <footer className="py-8 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 HealthMind. Empowering your wellness journey.</p>
        </div>
      </footer>

      <ChatPanel isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
