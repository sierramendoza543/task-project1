'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm p-8 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Task Project</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Streamline your productivity with an intuitive and powerful task management solution.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
              >
                Get Started Now →
              </Link>
            </motion.div>
          </motion.div>

          {/* Mission Section */}
          <motion.section
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                Task Project is designed to help you organize your work and life with simplicity and elegance. 
                We believe that productivity tools should be intuitive and adaptable to your unique workflow.
              </p>
              <p>
                Our goal is to provide a seamless task management experience that helps you focus on what matters most.
              </p>
            </div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Drag & Drop", icon: "🔄", description: "Intuitive task organization with drag-and-drop functionality" },
                { title: "Real-time Updates", icon: "⚡", description: "See changes instantly with real-time synchronization" },
                { title: "Custom Labels", icon: "🏷️", description: "Organize tasks with customizable categories and labels" },
                { title: "Analytics", icon: "📊", description: "Track your progress with detailed analytics and insights" },
                { title: "Secure", icon: "🔒", description: "Enterprise-grade security with Firebase authentication" },
                { title: "Responsive", icon: "📱", description: "Works seamlessly on desktop, tablet, and mobile" }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-gray-50 rounded-lg"
                >
                  <span className="text-3xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Creator Section */}
          <motion.section
            variants={fadeInUp}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">A Message from the Creator</h2>
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Hi, I'm Sierra Mendoza, the creator of Task Project. As a developer and productivity enthusiast,
                  I understand the importance of having a reliable and efficient task management system.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  I built Task Project to combine the best aspects of modern task management with a clean,
                  intuitive interface. I hope this tool helps you stay organized and accomplish your goals.
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-900 font-semibold italic">
                    - Sierra Mendoza
                  </p>
                  <p className="text-gray-500">Founder & Developer</p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            variants={fadeInUp}
            className="bg-indigo-600 rounded-xl shadow-sm p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of users who are already managing their tasks more effectively.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
              >
                Start Organizing Now →
              </Link>
            </motion.div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
} 