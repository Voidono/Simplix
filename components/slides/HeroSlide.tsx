'use client'

import { Bot, CircleDollarSign, HeartHandshake } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'; // Import the useTranslations hook
import { useParams } from 'next/navigation';
import { WavyBackground } from '../ui/wavy-background';
import Link from 'next/link';
import { Button } from '../ui/moving-border';

const HeroSlide = () => {
  const t = useTranslations('heroSlide');

  const params = useParams();
  const currentLocale = params.locale as string; // Assert as string, e.g., 'en' or 'vi'
  console.log(currentLocale)
  return (
    <WavyBackground
      blur={12}
      waveOpacity={0.3}
      speed="fast"
      waveWidth={40}
      backgroundFill='white'
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
    >
      <div className="flex flex-col flex-1 p-8 space-y-12 items-center">
        <Link href="/article">
          <Button
            containerClassName="h-10 w-48" // slimmer and slightly smaller
            className="bg-transparent text-base font-medium shadow-sm !py-0"
          >
            <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              Check out latest drama
            </span>
          </Button>
        </Link>
          <h1 className={`text-5xl ${
            currentLocale === 'en' ? 'font-mono' : ''
          } font-extrabold text-black text-center mt-16 leading-tight tracking-wider animate-fade-in-down`}>
            {t('revolutionizeAI')}
          </h1>
        <h3 className={`${currentLocale === 'en' ? 'font-mono' : ''} border-[1px] border-black rounded-4xl py-2 px-4 text-center`}>
          {t('researchArea')}
        </h3>
        <section className=' w-full grid grid-cols-3 text-center max-sm:grid-cols-1 gap-2'>
          <div className='w-full flex flex-col items-center'>
            <div className="relative w-40 h-40 flex items-center justify-center animate-pulse-once">
              <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-ping-slow"></div>
              <div className="absolute inset-4 bg-blue-300 opacity-40 rounded-full animate-ping-slow delay-200"></div>
              <div className="absolute inset-8 bg-blue-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
                <HeartHandshake className="w-16 h-16 text-blue-700 animate-bounce-subtle" />
              </div>
            </div>
            <p className={` ${currentLocale === 'en' ? 'font-mono' : ''} mt-2 font-bold text-lg`}>{t('safeAITherapist')}</p>
          </div>
          <div className='w-full flex flex-col items-center'>
            <div className="relative w-40 h-40 flex items-center justify-center animate-pulse-once">
              <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full animate-ping-slow"></div>
              <div className="absolute inset-4 bg-green-300 opacity-40 rounded-full animate-ping-slow delay-200"></div>
              <div className="absolute inset-8 bg-green-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
                <Bot className="w-16 h-16 text-green-700 animate-bounce-subtle" />
              </div>
            </div>
            <p className={` ${currentLocale === 'en' ? 'font-mono' : ''} mt-2 font-bold text-lg`}>{t('learningFromQuizzes')}</p>
          </div>
          <div className='w-full flex flex-col items-center'>
            <div className="relative w-40 h-40 flex items-center justify-center animate-pulse-once">
              <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-full animate-ping-slow"></div>
              <div className="absolute inset-4 bg-purple-300 opacity-40 rounded-full animate-ping-slow delay-200"></div>
              <div className="absolute inset-8 bg-purple-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
                <CircleDollarSign className="w-16 h-16 text-purple-700 animate-bounce-subtle" />
              </div>
            </div>
            <p className={` ${currentLocale === 'en' ? 'font-mono' : ''} mt-2 font-bold text-lg`}>{t('investingWithAI')}</p>
          </div>
        </section>
      </div>
    </WavyBackground>
  )
}

export default HeroSlide