import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartGame: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
  const [showCredits, setShowCredits] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const fullText = 'NETFLOW';

  // Typewriter effect for title
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setAnimatedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(timer);
      }
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Pixel grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Animated network lines in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              width: '200%',
              left: '-50%',
            }}
            animate={{
              x: ['-25%', '25%'],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* 8-bit style logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-8"
        >
          {/* Pixel art router icon */}
          <div className="mx-auto mb-4 relative">
            <div className="text-8xl mb-2" style={{
              textShadow: '4px 4px 0 #1e40af, 8px 8px 0 #1e3a8a',
              fontFamily: 'monospace'
            }}>
              🔀
            </div>
            {/* Animated data packets */}
            <motion.div
              className="absolute -right-4 top-1/2 w-3 h-3 bg-cyan-400 rounded-sm"
              animate={{
                x: [0, 60, 60, 0],
                opacity: [1, 1, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute -left-4 top-1/2 w-3 h-3 bg-green-400 rounded-sm"
              animate={{
                x: [0, -60, -60, 0],
                opacity: [1, 1, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: 1,
              }}
            />
          </div>

          {/* Title with pixelated font effect */}
          <h1
            className="text-6xl md:text-8xl font-bold tracking-wider"
            style={{
              fontFamily: '"Press Start 2P", "Courier New", monospace',
              textShadow: '4px 4px 0 #3b82f6, 8px 8px 0 #1d4ed8',
              letterSpacing: '0.1em',
              imageRendering: 'pixelated',
            }}
          >
            <span className="text-white">{animatedText}</span>
            <motion.span
              className="text-blue-400"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              _
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-xl md:text-2xl text-gray-400 mt-4"
            style={{ fontFamily: 'monospace' }}
          >
            Network Engineering Simulator
          </motion.p>
        </motion.div>

        {/* Tagline with typing effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mb-12 max-w-xl mx-auto"
        >
          <p className="text-gray-500 text-sm md:text-base mb-2" style={{ fontFamily: 'monospace' }}>
            &gt; Build networks. Route packets. Learn IT.
          </p>
          <p className="text-gray-600 text-xs" style={{ fontFamily: 'monospace' }}>
            &gt; Think of it like plumbing... but for data!
          </p>
        </motion.div>

        {/* Start button - 8-bit style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            onClick={onStartGame}
            className="relative group"
          >
            {/* Button shadow layers for 3D effect */}
            <div className="absolute inset-0 bg-blue-900 translate-x-2 translate-y-2" />
            <div className="absolute inset-0 bg-blue-800 translate-x-1 translate-y-1" />

            {/* Main button */}
            <div className="relative px-12 py-4 bg-blue-600 border-4 border-blue-400
                          hover:bg-blue-500 active:translate-x-1 active:translate-y-1
                          transition-transform cursor-pointer">
              <span
                className="text-xl md:text-2xl text-white font-bold tracking-widest"
                style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1rem' }}
              >
                START GAME
              </span>
            </div>
          </button>

          {/* Blinking prompt */}
          <motion.p
            className="mt-6 text-gray-500 text-sm"
            style={{ fontFamily: 'monospace' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Press START to begin your network journey
          </motion.p>
        </motion.div>

        {/* Credits toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-12"
        >
          <button
            onClick={() => setShowCredits(!showCredits)}
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
            style={{ fontFamily: 'monospace' }}
          >
            [ {showCredits ? 'HIDE' : 'VIEW'} CREDITS ]
          </button>
        </motion.div>
      </div>

      {/* Credits modal */}
      {showCredits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 border-2 border-gray-700
                     p-6 rounded-lg max-w-md text-center z-20"
        >
          <h3
            className="text-lg font-bold text-blue-400 mb-4"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.75rem' }}
          >
            CREDITS
          </h3>
          <div className="space-y-3 text-sm" style={{ fontFamily: 'monospace' }}>
            <div>
              <p className="text-gray-400">Created by</p>
              <p className="text-white font-bold">Sean Mahoney</p>
            </div>
            <div className="text-gray-600">+</div>
            <div>
              <p className="text-gray-400">AI Development Partner</p>
              <p className="text-white font-bold">Claude.ai</p>
              <p className="text-gray-500 text-xs">by Anthropic</p>
            </div>
            <div className="pt-4 border-t border-gray-700 text-gray-500 text-xs">
              <p>Built with React, TypeScript, and Zustand</p>
              <p className="mt-1">© 2024 • Open Source</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decorative pixels in corners */}
      <div className="absolute top-4 left-4 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="absolute top-4 right-4 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-green-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 text-gray-700 text-xs" style={{ fontFamily: 'monospace' }}>
        v1.0.0-MVP
      </div>
    </div>
  );
};
