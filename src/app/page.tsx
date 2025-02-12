'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const { } = useAuth();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-white" ref={ref}>
      {/* Modern Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed w-full z-50 bg-white/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <h1 className="text-2xl font-bold text-gray-900 font-space tracking-tight">
                Task Project
              </h1>
            </motion.div>
            <div className="flex gap-6">
              <Link
                href="/login"
                className="link-underline text-gray-900 font-dm hover:text-gray-600 transition-colors flex items-center justify-center"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-hover-effect px-6 py-2 bg-gray-900 text-white rounded-full font-dm hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-pink-100 opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 font-space leading-tight">
            Organize Tasks.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              Track Progress.
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 font-dm max-w-2xl mx-auto">
            Streamline your workflow with our intuitive task management platform. 
            Built for individuals and teams who value clarity and efficiency.
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="btn-hover-effect group relative px-8 py-3 bg-gray-900 text-white rounded-full font-dm text-lg hover:bg-gray-800 transition-all duration-300 ease-out hover:shadow-lg flex items-center justify-center"
            >
              <span className="group-hover:-translate-x-2 transition-transform duration-300">
                Get Started
              </span>
              <motion.span
                className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
              >
                →
              </motion.span>
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-dm text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white to-transparent"
        />
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 font-space mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 font-dm max-w-2xl mx-auto">
              Powerful features that help you take control of your tasks and boost productivity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Task Management",
                description: "Organize tasks with custom labels, priorities, and due dates. Drag and drop to reorder effortlessly.",
                icon: "📋"
              },
              {
                title: "Real-time Analytics",
                description: "Track your productivity with comprehensive analytics, including completion rates and trends.",
                icon: "📊"
              },
              {
                title: "Team Collaboration",
                description: "Share tasks and goals with team members. Stay aligned with shared progress tracking.",
                icon: "👥"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 font-space mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-dm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-3 w-3 rounded-full bg-indigo-600"
                      />
                    </div>
                    <span className="text-lg font-dm text-gray-900">Live Demo Preview</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-gray-800 font-dm">Create your first task</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        whileInView={{ width: "75%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-pink-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                quote: 'This app has transformed how I manage my daily tasks. The analytics are incredibly helpful!',
                author: 'Sarah M.',
                role: 'Product Manager'
              },
              {
                quote: 'Clean interface and powerful features. Exactly what I needed for task management.',
                author: 'Alex R.',
                role: 'Freelancer'
              },
              {
                quote: 'The ability to track progress and see trends has helped me improve my productivity.',
                author: 'John D.',
                role: 'Software Developer'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <p className="text-gray-600 font-dm italic mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-gray-900 font-space">{testimonial.author}</p>
                  <p className="text-gray-500 font-dm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-space mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 font-dm mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their productivity with Task Project.
            </p>
            <Link
              href="/signup"
              className="btn-hover-effect inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-dm text-lg hover:shadow-lg transition-all duration-300"
            >
              Start for free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 font-dm">
              © {new Date().getFullYear()} Task Project. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
