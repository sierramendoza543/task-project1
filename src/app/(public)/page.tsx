'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Calendar, CheckCircle, Target, ArrowRight } from 'lucide-react';
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

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Enhanced Background */}
      <motion.div style={{ opacity, scale }}>
        <div className="relative min-h-screen flex items-center">
          <AnimatedBackground />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
            <motion.div
              style={{ y, opacity }}
              className="text-center space-y-8"
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-bold text-gray-900 font-space"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Organize Tasks,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Achieve More
                </span>
              </motion.h1>
              
              <motion.p
                className="max-w-2xl mx-auto text-xl text-gray-600 font-dm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your all-in-one solution for task management, goal tracking, and team collaboration.
                Start organizing your work life today.
              </motion.p>

              <motion.div
                className="flex items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/signup"
                  className="group relative px-8 py-3 bg-indigo-600 text-white rounded-xl overflow-hidden font-dm"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    animate={{ x: isHovered ? 5 : 0 }}
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-indigo-700"
                    initial={{ scale: 0 }}
                    animate={{ scale: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3 text-gray-600 hover:text-gray-900 transition-colors font-dm"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Experience Section with Enhanced Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
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
                  viewport={{ once: false }}
                >
                  FEATURES
                </motion.span>
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 font-space mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 }}
                >
                  Experience Modern Task Management
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 font-dm max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 }}
                >
                  Streamline your workflow with our comprehensive suite of features designed to help you stay organized and productive.
                </motion.p>
              </div>
            </ScrollFade>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Intelligent Task Organization",
                  description: "Prioritize tasks automatically based on due dates, importance, and project dependencies. Our smart algorithms help you focus on what matters most.",
                  features: ["Smart prioritization", "Custom categories", "Bulk task management"]
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Goal Setting & Tracking",
                  description: "Set meaningful goals and break them down into achievable tasks. Track your progress with visual indicators and celebrate your wins.",
                  features: ["Progress tracking", "Milestone creation", "Achievement rewards"]
                },
                {
                  icon: <Calendar className="w-8 h-8" />,
                  title: "Advanced Calendar View",
                  description: "Visualize your tasks and deadlines in our intuitive calendar interface. Never miss an important date with smart reminders.",
                  features: ["Multiple views", "Drag & drop", "Smart reminders"]
                }
              ].map((feature, index) => (
                <ScrollFade key={feature.title} delay={index * 0.2}>
                  <motion.div
                    className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                      {feature.icon}
                    </div>
                    <motion.h3 
                      className="text-xl font-bold mb-4 font-space relative inline-block"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        style={{ originX: 0, zIndex: 0 }}
                      />
                      <span className="relative z-10 px-2 py-1 transition-colors duration-300 group-hover:text-white">
                        {feature.title}
                      </span>
                    </motion.h3>
                    <p className="text-gray-600 font-dm mb-6 group-hover:text-gray-900 transition-colors">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.features.map((item, i) => (
                        <motion.li 
                          key={item}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors cursor-default"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                          whileHover={{ x: 5 }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
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
                  "Deadline reminders and notifications",
                  "Sync with popular calendar apps"
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
                  Join thousands of users who are already organizing their lives better.
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