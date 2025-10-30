'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * HeroSplitHorizon - Simple typographic hero
 * Clean, bold typography with call-to-action buttons
 */
export default function HeroSplitHorizon() {

  const lineVariants = {
    hidden: { opacity: 0, x: -30, filter: 'blur(4px)' },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const lines = [
    { text: 'Pilot', weight: 'font-black tracking-tight' },
    { text: 'Educator', weight: 'font-black tracking-tight' },
    { text: 'Developer', weight: 'font-black tracking-tight' },
  ];

  return (
    <section className="relative isolate lg:min-h-screen flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-gray-900 lg:p-8 lg:gap-8">
      {/* SVG Grid Background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="hero-grid-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#hero-grid-pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>

      {/* Gradient Blur */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-20"
        />
      </div>

      <motion.div
        className="w-full lg:w-3/5 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-0 lg:min-h-screen"
        initial="hidden"
        animate="visible"
      >
        {/* Headline with simple, bold text */}
        <div className="max-w-2xl">
          {lines.map((line, i) => (
            <motion.h1
              key={i}
              custom={i}
              variants={lineVariants}
              className={`text-6xl sm:text-7xl lg:text-8xl xl:text-9xl ${line.weight} text-gray-900 dark:text-white leading-none mb-1`}
            >
              {line.text}
              <span className="text-emerald-600 dark:text-emerald-400">.</span>
            </motion.h1>
          ))}

          <motion.p
            custom={3}
            variants={lineVariants}
            className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mt-12 max-w-xl leading-relaxed"
          >
            Practical lessons from flying, teaching, and shipping web development.
          </motion.p>

          <motion.div custom={4} variants={lineVariants} className="flex gap-4 mt-12 flex-wrap">
            <Link href="/blog">
              <Button
                size="lg"
                className="px-8 py-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all group cursor-pointer"
              >
                Read Articles
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
            <Link href="https://cfipros.com" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 border-2 bg-transparent dark:hover:bg-slate-800 hover:ring-2 ring-gray-300 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100  text-lg font-semibold transition-all cursor-pointer"
              >
                Visit CFiPros
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Aircraft */}
      <motion.div
        className="w-full lg:w-2/5 px-8 lg:px-0 py-12 lg:py-0 relative overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Aircraft image - hidden on mobile, visible on desktop */}
        <motion.div
          initial={{ y: 100, opacity: 0, rotate: 20 }}
          animate={{ y: 0, opacity: 1, rotate: 20 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute -right-[0%] top-[45%] -translate-y-1/2 w-[120%] h-[120%] md:w-[120%] md:h-[120%] lg:w-[110%] lg:h-[110%] hidden lg:block"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(16, 185, 129, 0.2))'
          }}
        >
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/8  blur-3xl" />

          {/* Light mode aircraft */}
          <div className="relative w-full h-full dark:hidden">
            <Image
              src="/images/Light.svg"
              alt="CRJ900 Aircraft"
              fill
              className="object-contain object-center"
            />
          </div>

          {/* Dark mode aircraft */}
          <div className="relative w-full h-full hidden dark:block">
            <Image
              src="/images/Dark.svg"
              alt="CRJ900 Aircraft"
              fill
              className="object-contain object-center"
            />
          </div>
        </motion.div>

        {/* "What I fly" SVG annotation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute top-1/4 right-[65%] hidden lg:block w-32 h-24"
        >
          {/* Light mode - gray text color */}
          <div className="relative w-full h-full dark:hidden">
            <Image
              src="/images/WhatIfly.svg"
              alt="What I fly"
              fill
              className="object-contain brightness-0 saturate-100"
              style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg)' }}
            />
          </div>

          {/* Dark mode - white */}
          <div className="relative w-full h-full hidden dark:block">
            <Image
              src="/images/WhatIfly.svg"
              alt="What I fly"
              fill
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient for smooth transition */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"
      />
    </section>
  );
}
