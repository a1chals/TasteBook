'use client'

import { motion } from 'framer-motion'

export function Chef3D() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating animation wrapper */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateY: [0, 10, 0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-full scale-150"></div>
        
        {/* Chef Hat - 3D Style */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          className="relative z-10 drop-shadow-2xl"
        >
          {/* Hat base (bottom part) */}
          <defs>
            <linearGradient id="hatBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="hatTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Base of hat (headband) */}
          <ellipse
            cx="100"
            cy="140"
            rx="70"
            ry="12"
            fill="url(#hatBase)"
            filter="url(#shadow)"
          />
          <ellipse
            cx="100"
            cy="138"
            rx="68"
            ry="10"
            fill="#e2e8f0"
          />
          
          {/* Main puffed top part */}
          <motion.g
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Back puffs */}
            <circle cx="70" cy="80" r="32" fill="url(#hatTop)" opacity="0.9" />
            <circle cx="130" cy="80" r="32" fill="url(#hatTop)" opacity="0.9" />
            
            {/* Middle puffs */}
            <circle cx="60" cy="60" r="36" fill="url(#hatTop)" />
            <circle cx="100" cy="50" r="38" fill="url(#hatTop)" />
            <circle cx="140" cy="60" r="36" fill="url(#hatTop)" />
            
            {/* Front center puff */}
            <circle cx="100" cy="70" r="35" fill="#ffffff" />
            
            {/* Highlights */}
            <ellipse cx="85" cy="60" rx="12" ry="18" fill="white" opacity="0.6" />
            <ellipse cx="110" cy="55" rx="10" ry="15" fill="white" opacity="0.5" />
          </motion.g>
          
          {/* Hat band details */}
          <path
            d="M 30 138 Q 100 143 170 138"
            stroke="#94a3b8"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 30 142 Q 100 147 170 142"
            stroke="#cbd5e1"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
        </svg>
        
        {/* Sparkle effects */}
        <motion.div
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0,
          }}
          className="absolute top-10 right-10 w-2 h-2 bg-white rounded-full"
        />
        <motion.div
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.7,
          }}
          className="absolute top-20 left-8 w-1.5 h-1.5 bg-white rounded-full"
        />
        <motion.div
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1.4,
          }}
          className="absolute bottom-20 right-12 w-2 h-2 bg-white rounded-full"
        />
      </motion.div>
    </div>
  )
}

