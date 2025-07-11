import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

const AiTherapySlide = () => {
  return (
    <div className="flex flex-col flex-1 p-8 space-y-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen justify-center items-center">
      <h1 className="text-5xl font-extrabold text-blue-900 text-center leading-tight tracking-wider animate-fade-in-down">
        Hi, how are you feeling right now?
      </h1>
      <h1 className="text-xl font-extrabold text-blue-700 text-center leading-tight tracking-wider animate-fade-in-down">
        I&apos;m an AI therapist, ready to chat when you are sad, happy, etc
      </h1>

      <section className="w-full grid md:grid-cols-2 gap-8 items-center max-w-5xl">
        {/* Left Side: Animated Circle + Button */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-ping-slow" />
            <div className="absolute inset-4 bg-blue-300 opacity-30 rounded-full animate-ping-slow delay-200" />
            <div className="absolute inset-8 bg-blue-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
              <HeartHandshake className="w-14 h-14 text-blue-700 animate-bounce-subtle" />
            </div>
          </div>
          <Button asChild className="rounded-3xl px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white shadow-lg border-2 border-white transition duration-200">
            <Link href={`/ai-therapist`}>Explore now</Link>
          </Button>
        </div>

        {/* Right Side: Highlight Box */}
        <div className="p-6 border-2 border-blue-700 bg-blue-50 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Safe AI Chatbot</h2>
          <p className="text-blue-600">AI now can identify, categorize people to suitable real therapists, flag level of health and risk</p>
          <p className="text-blue-800 font-bold mt-4">Using Gemini blocks</p>
        </div>
      </section>
    </div>
  );
}

export default AiTherapySlide;