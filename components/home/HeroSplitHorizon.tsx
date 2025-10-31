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
    <section className="relative isolate lg:min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[var(--bg)] lg:p-8 lg:gap-8">
      {/* SVG Grid Background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-[var(--border)]"
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
        <svg x="50%" y={-1} className="overflow-visible fill-[var(--surface-muted)]">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#hero-grid-pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>

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
              className={`text-6xl sm:text-7xl lg:text-8xl xl:text-9xl ${line.weight} text-[var(--text)] leading-none mb-1`}
            >
              {line.text}
              <span className="text-[var(--primary)]">.</span>
            </motion.h1>
          ))}

          <motion.p
            custom={3}
            variants={lineVariants}
            className="text-xl lg:text-2xl text-[var(--text-muted)] mt-12 max-w-2xl leading-relaxed"
          >
            Practical lessons from flying, teaching, and building things.
          </motion.p>

          <motion.div custom={4} variants={lineVariants} className="flex gap-4 mt-12 flex-wrap">
            <Link href="/blog">
              <Button
                size="lg"
                className="px-8 py-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] text-lg font-semibold shadow-lg hover:shadow-xl transition-all group cursor-pointer"
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
                className="px-8 py-6 border-2 bg-transparent hover:bg-[var(--surface)] hover:ring-2 ring-[var(--border)] border-[var(--border)] text-[var(--text)] text-lg font-semibold transition-all cursor-pointer"
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
        >
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
    </section>
  );
}
