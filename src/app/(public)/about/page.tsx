'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section - Removed animations, made bigger */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
              About Task Project
            </h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to help you achieve more by managing your tasks effectively.
            </p>
          </div>

          {/* Message from the Creator Section */}
          <section className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 text-center mb-12"
            >
              Message from the Creator
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-full max-w-md mx-auto"
                style={{ height: '600px' }}
              >
                <Image
                  src="/sierra-profile.jpg"
                  alt="Sierra Mendoza"
                  fill
                  className="object-cover rounded-2xl shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div 
                  className="space-y-6 text-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Dear User,
                  </motion.p>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    As a passionate developer and productivity enthusiast, I created Task Project 
                    to solve a problem I personally faced: the need for a simple yet powerful task 
                    management system that adapts to how people naturally work.
                  </motion.p>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    My goal was to combine intuitive design with powerful features, making it easier 
                    for everyone to stay organized and accomplish their goals. This project represents 
                    my commitment to creating tools that make a real difference in people's daily lives.
                  </motion.p>
                  <motion.p 
                    className="text-gray-700 italic mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <span className="font-bold">From Sierra Mendoza,</span><br />
                    <span className="font-normal">Founder/Developer</span>
                  </motion.p>
                </motion.div>
                <motion.div 
                  className="pt-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href="https://github.com/sierramendoza543"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
                  >
                    <span>View More Projects</span>
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 text-center mb-12"
            >
              Our Values
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Simplicity",
                  description: "We believe in making complex things simple and accessible.",
                  icon: "🎯"
                },
                {
                  title: "Innovation",
                  description: "We continuously evolve and improve our platform.",
                  icon: "💡"
                },
                {
                  title: "User-Focused",
                  description: "Every feature is designed with our users in mind.",
                  icon: "👥"
                }
              ].map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px -15px rgba(0,0,0,0.2)"
                  }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300"
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white transition-all duration-300"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their tasks more effectively 
              with Task Project.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg group"
              >
                <span>Start Organizing Today</span>
                <motion.span
                  className="ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.section>
        </main>
      </div>
      <Footer />
    </>
  );
} 