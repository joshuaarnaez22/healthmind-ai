"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Apple } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/dark-mode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FeatureCard from "./feature-card";
import MobileNav from "./mobile-nav";
import ChatPanel from "./chat-panel";
import Link from "next/link";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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

      <main className="container mx-auto px-4 py-12 flex flex-col flex-grow">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-20"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 text-gray-800 dark:text-white">
            Your Health,{" "}
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
          className="grid md:grid-cols-3 gap-8 mb-20"
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
          transition={{ delay: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            Join Our Community
          </h2>
          <div className="flex justify-center space-x-4">
            <Avatar className="border-4 border-purple-500 size-20">
              <AvatarImage src="/" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            <Avatar className="border-4 border-green-500 size-20">
              <AvatarImage src="/" />
              <AvatarFallback>CC</AvatarFallback>
            </Avatar>
            <Avatar className="border-4 border-blue-500 size-20">
              <AvatarImage src="/" />
              <AvatarFallback>WA</AvatarFallback>
            </Avatar>
          </div>
        </motion.section>
      </main>

      <footer className="py-8 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 mt">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 HealthMind. Empowering your wellness journey.</p>
        </div>
      </footer>

      <ChatPanel isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </div>
  );
}
