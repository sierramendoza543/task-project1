'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const features = [
  {
    title: "Smart Task Organization",
    description: "Drag-and-drop interface with intelligent sorting",
    icon: "📋",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Real-time Analytics",
    description: "Visual insights and progress tracking",
    icon: "📈",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Goal Setting",
    description: "Set and track measurable goals",
    icon: "🎯",
    gradient: "from-orange-500 to-red-500"
  }
];

export default function HomePage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const scrollToFeatures = () => {
    const demoSection = document.querySelector('.interactive-demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" ref={targetRef}>
      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative z-10 text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-7xl font-bold mb-6"
            >
              <span className="text-gray-900">Organize Tasks.</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                Track Progress.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Streamline your workflow with our intuitive task management platform.
              <br />
              Built for individuals and teams who value clarity and efficiency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="group relative px-8 py-4 bg-indigo-600 rounded-lg overflow-hidden w-[180px]"
              >
                <span className="relative z-10 flex items-center justify-center w-full text-white text-lg font-semibold whitespace-nowrap">
                  <span className="transform group-hover:-translate-x-3 transition-transform duration-300">
                    Get Started
                  </span>
                  <span className="absolute right-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    →
                  </span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              </Link>
              <button
                onClick={scrollToFeatures}
                className="relative px-8 py-4 bg-white rounded-lg group text-lg font-semibold overflow-hidden w-[180px]"
              >
                <span className="relative z-10 text-indigo-600 group-hover:text-white transition-colors duration-300">
                  Learn More
                </span>
                <span className="absolute inset-0 bg-purple-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-indigo-600/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white overflow-hidden interactive-demo-section">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Experience Task Management</h2>
            <p className="text-gray-600 text-lg">
              Discover how Task Project transforms your workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo Display */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl transform -rotate-2"></div>
              <motion.div 
                className="relative bg-white p-8 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-4">
                  {/* Task Cards */}
                  <motion.div 
                    className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500"
                    whileHover={{ x: 10 }}
                  >
                    <h4 className="font-semibold text-indigo-900">Project Planning</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-indigo-600">High Priority</span>
                      <span className="text-sm text-indigo-600">Due Today</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                    whileHover={{ x: 10 }}
                  >
                    <h4 className="font-semibold text-purple-900">Team Meeting</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-purple-600">Medium Priority</span>
                      <span className="text-sm text-purple-600">Tomorrow</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500"
                    whileHover={{ x: 10 }}
                  >
                    <h4 className="font-semibold text-pink-900">Review Goals</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-pink-600">Ongoing</span>
                      <span className="text-sm text-pink-600">This Week</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  title: "Drag & Drop Tasks",
                  description: "Effortlessly organize your workflow with intuitive drag and drop",
                  icon: "🔄"
                },
                {
                  title: "Smart Prioritization",
                  description: "Automatically sort tasks based on due dates and importance",
                  icon: "⭐"
                },
                {
                  title: "Progress Tracking",
                  description: "Visual progress bars and completion statistics",
                  icon: "📊"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-white rounded-xl shadow-sm"
                >
                  <span className="text-3xl mr-4">{feature.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Feature Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">New: Calendar View</h2>
            <p className="text-gray-600 text-lg">
              Visualize your tasks in an intuitive monthly calendar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature Description */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-4">Visual Task Management</h3>
              <p className="text-gray-600 text-lg mb-6">
                Our new calendar feature brings a visual dimension to task management.
                See your tasks laid out across the month, quickly identify busy periods,
                and manage your time more effectively.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: "📅", text: "Monthly overview of all tasks" },
                  { icon: "🎨", text: "Color-coded priority indicators" },
                  { icon: "👆", text: "Quick task preview on hover" },
                  { icon: "🔄", text: "Seamless integration with task list" }
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Interactive Calendar Mockup */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl transform rotate-2"></div>
              <motion.div 
                className="relative bg-white p-6 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">March 2024</h4>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded">←</button>
                    <button className="p-2 hover:bg-gray-100 rounded">→</button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Week days */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days with sample tasks */}
                  {[...Array(35)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square p-1 border rounded-lg hover:border-indigo-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-right text-sm text-gray-600 mb-1">
                        {((i + 1) % 31) + 1}
                      </div>
                      {i % 7 === 3 && (
                        <motion.div
                          className="text-xs p-1 bg-red-100 text-red-800 rounded mb-1 truncate"
                          whileHover={{ scale: 1.1 }}
                          title="High Priority Task"
                        >
                          High Priority...
                        </motion.div>
                      )}
                      {i % 5 === 2 && (
                        <motion.div
                          className="text-xs p-1 bg-green-100 text-green-800 rounded truncate"
                          whileHover={{ scale: 1.1 }}
                          title="Task Completed"
                        >
                          Complete
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your account in seconds" },
              { step: "2", title: "Add Tasks", description: "Quickly input your tasks and goals" },
              { step: "3", title: "Organize", description: "Categorize and prioritize your work" },
              { step: "4", title: "Track", description: "Monitor progress and celebrate wins" }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already managing their tasks more effectively.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
              >
                Start Organizing Today →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
