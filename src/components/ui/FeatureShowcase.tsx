'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle, Calendar, Target, Users } from 'lucide-react';

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Task Management",
      description: "Organize tasks with intelligent prioritization",
      preview: "/task-preview.png" // You'll need to add these images
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Calendar View",
      description: "Visualize your schedule effortlessly",
      preview: "/calendar-preview.png"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Tracking",
      description: "Set and achieve meaningful goals",
      preview: "/goals-preview.png"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description: "Work together seamlessly",
      preview: "/collab-preview.png"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className={`p-6 rounded-xl cursor-pointer transition-all ${
              activeFeature === index 
                ? 'bg-white shadow-lg scale-105' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setActiveFeature(index)}
            whileHover={{ x: activeFeature === index ? 0 : 5 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 font-space">{feature.title}</h3>
                <p className="text-gray-600 font-dm">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl"
        style={{ scale }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={features[activeFeature].preview} 
            alt={features[activeFeature].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
} 