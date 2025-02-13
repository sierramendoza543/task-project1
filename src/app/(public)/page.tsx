'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import { Calendar, CheckCircle, Target, ArrowRight, Sparkles, Zap, Shield, Users } from 'lucide-react';
import FloatingShapes from '@/components/ui/FloatingShapes';
import CalendarMockup from '@/components/ui/CalendarMockup';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import Footer from '@/components/layout/Footer';
import ScrollFade from '@/components/ui/ScrollFade';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);

  // Interactive particle background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1
  }));

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
          
          {/* Animated gradient orbs */}
          <motion.div 
            className="absolute left-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute right-1/4 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-400/20 blur-[100px]"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <motion.h1 
              className="text-6xl md:text-7xl font-bold text-gray-900 font-space"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Manage tasks 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                with clarity
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-dm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Stay organized and focused with our intuitive task management platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-dm text-lg shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all duration-300 font-dm text-lg border border-gray-200 shadow-lg shadow-gray-200/20 hover:shadow-xl"
              >
                Log In
              </Link>
            </motion.div>
          </div>
        </div>

        {/* New Arrow Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </motion.svg>
        </motion.div>
      </section>

      {/* Experience Section with Enhanced Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollFade>
              <div className="text-center mb-16">
                <motion.span 
                  className="text-indigo-600 font-medium font-dm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  FEATURES
                </motion.span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-space mb-6">
                  Experience Modern Task Management
                </h2>
                <p className="text-xl text-gray-600 font-dm max-w-3xl mx-auto">
                  Streamline your workflow with our comprehensive suite of features.
                </p>
              </div>
            </ScrollFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Intelligent Task Organization",
                  description: "Prioritize tasks automatically based on due dates, importance, and project dependencies.",
                  features: ["Smart prioritization", "Custom categories", "Bulk task management"]
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Goal Setting & Tracking",
                  description: "Set meaningful goals and break them down into achievable tasks.",
                  features: ["Progress tracking", "Milestone creation", "Achievement rewards"]
                },
                {
                  icon: <Calendar className="w-8 h-8" />,
                  title: "Advanced Calendar View",
                  description: "Visualize your tasks and deadlines in our intuitive calendar interface.",
                  features: ["Multiple views", "Drag & drop", "Smart reminders"]
                }
              ].map((feature, index) => (
                <ScrollFade key={feature.title} delay={index * 0.2}>
                  <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                    <div className="bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 font-space text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-dm mb-6">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.features.map((item) => (
                        <li 
                          key={item}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollFade>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calendar Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Text content - takes up 2 columns */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}  // Changed to false to repeat animations
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-gray-900 font-space mb-8">
                Visualize Your Schedule
              </h2>
              <p className="text-gray-600 text-lg font-dm mb-8">
                Visualize your tasks and deadlines in our new calendar view. 
                Plan ahead and never miss important dates.
              </p>
              <ul className="space-y-4">
                {[
                  "Monthly, weekly, and daily views",
                  "Drag and drop task scheduling",
                  "Share goals with others"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700 font-dm">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Calendar preview - takes up 3 columns */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}  // Changed to false to repeat animations
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <CalendarMockup />
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works with Animated Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollFade>
              <h2 className="text-4xl font-bold text-center text-gray-900 font-space mb-16">
                How It Works
              </h2>
            </ScrollFade>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Sign Up", description: "Create your free account" },
                { step: "2", title: "Add Tasks", description: "Start adding your tasks and goals" },
                { step: "3", title: "Organize", description: "Categorize and prioritize" },
                { step: "4", title: "Track", description: "Monitor progress and achieve more" }
              ].map((item, index) => (
                <ScrollFade key={item.step} delay={index * 0.2} direction="up">
                  <motion.div 
                    className="text-center group"
                    whileHover={{ y: -5 }}
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold group-hover:scale-110 transition-transform"
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 360,
                        transition: { duration: 0.5 }
                      }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 font-space group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-dm">
                      {item.description}
                    </p>
                  </motion.div>
                </ScrollFade>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollFade direction="up">
              <div className="text-center space-y-6">
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 font-space"
                  whileHover={{ scale: 1.05 }}
                >
                  Ready to Get Started?
                </motion.h2>
                <p className="text-xl text-gray-600 font-dm max-w-2xl mx-auto">
                  Join a community of users who are already organizing their lives better.
                  It's completely free!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 font-dm hover:gap-4"
                  >
                    Get Started
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </ScrollFade>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
} 