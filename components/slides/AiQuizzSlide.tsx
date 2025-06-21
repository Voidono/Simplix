import React from 'react'
import { Button } from '../ui/button'
import { Bot } from 'lucide-react'
import Link from 'next/link'

const AiQuizzSlide = () => {
  return (
    <div className="flex flex-col flex-1 p-8 space-y-12 bg-gradient-to-br from-green-50 to-indigo-100 min-h-screen justify-center items-center">
      <h1 className="text-5xl font-extrabold text-green-900 text-center leading-tight tracking-wider animate-fade-in-down">
        Hi, wanna learn and do some quizzes?
      </h1>
      <h1 className="text-xl font-extrabold text-green-700 text-center leading-tight tracking-wider animate-fade-in-down">
        I'm Quizz AI, test your knowledge on 3 levels, and see explainations
      </h1>

      <section className="w-full grid md:grid-cols-2 gap-8 items-center max-w-5xl">
        {/* Right Side: Highlight Box */}
        <div className="p-6 border-2 border-green-700 bg-green-50 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-green-800 mb-2">Quizz Generation and Superior Memories</h2>
          <p className="text-green-600">AI now can generate components, remember, analyze past data for further question</p>
        </div>
        {/* Left Side: Animated Circle + Button */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-40 h-40 flex items-center justify-center animate-pulse-once">
            <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full animate-ping-slow"></div>
            <div className="absolute inset-4 bg-green-300 opacity-40 rounded-full animate-ping-slow delay-200"></div>
            <div className="absolute inset-8 bg-green-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
              <Bot className="w-16 h-16 text-green-700 animate-bounce-subtle" />
            </div>
          </div>
          <Button asChild className=" rounded-4xl shadow-2xl bg-green-500 hover:bg-green-700 text-white border-2 border-white">
            <Link href={`/ai-quizz`}>Explore now</Link>
          </Button>
        </div>

      </section>
    </div>
  )
}

export default AiQuizzSlide