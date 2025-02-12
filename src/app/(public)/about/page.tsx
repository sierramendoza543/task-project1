'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 }
};

export default function About() {
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12 mt-20"
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-16 text-center"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        About Task Project
      </motion.h1>
      
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <motion.div 
            className="w-full md:w-1/2"
            variants={fadeInLeft}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/creator-steinway.jpg"
              alt="Creator at Steinway & Sons"
              width={500}
              height={600}
              className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 space-y-6"
            variants={fadeInRight}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-semibold">Message from the Creator</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Welcome to Task Project! I created this platform to help streamline workflow 
              and make task management more intuitive. As a high-school student, I take 
              productivity and organization very seriously, 
              and these values are illustrated throughout the platform.
              I wanted to build a tool that makes everyone's 
              work and personal life a little easier.
            </p>
            <motion.div 
              className="pt-4"
              variants={scaleIn}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-gray-900 font-semibold italic">
                - Sierra Mendoza
              </p>
              <p className="text-gray-500">
                Founder & Developer
              </p>
              <motion.div 
                className="flex gap-4 mt-4"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { delay: 0.5 } }
                }}
              >
                <motion.a 
                  href="https://www.linkedin.com/in/sierra-mendoza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin size={24} />
                </motion.a>
                <motion.a 
                  href="https://github.com/sierramendoza543/task-project1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub size={24} />
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="prose max-w-none"
        variants={fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-lg text-gray-700 text-center">
          Task Project is designed to be simple yet powerful, helping individuals and teams 
          stay organized and productive. Our platform combines intuitive design with powerful 
          features to create the perfect task management solution.
        </p>
      </motion.div>
    </motion.div>
  );
} 