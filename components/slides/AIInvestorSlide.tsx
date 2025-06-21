import {
  CircleDollarSign,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

const AIInvestorSlide = () => {
  return (
    <div className="flex flex-col flex-1 p-8 space-y-12 bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen justify-center items-center">
      <h1 className="text-5xl font-extrabold text-purple-900 text-center leading-tight tracking-wider animate-fade-in-down">
        Cursor for investors
      </h1>
      <h1 className="text-xl font-extrabold text-purple-700 text-center leading-tight tracking-wider animate-fade-in-down">
        Seeing real time data, analyze and give strategy (not that correct)
      </h1>

      <section className="w-full grid md:grid-cols-2 gap-8 items-center max-w-5xl">
        {/* Left Side: Animated Circle + Button */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-full animate-ping-slow" />
            <div className="absolute inset-4 bg-purple-300 opacity-30 rounded-full animate-ping-slow delay-200" />
            <div className="absolute inset-8 bg-purple-200 rounded-full shadow-lg flex items-center justify-center animate-pop-in">
              <CircleDollarSign className="w-14 h-14 text-purple-700 animate-bounce-subtle" />
            </div>
          </div>
          <Button asChild className="rounded-3xl px-6 py-2 bg-purple-500 hover:bg-purple-700 text-white shadow-lg border-2 border-white transition duration-200">
            <Link href={`/ai-investor`}>Explore now</Link>
          </Button>
        </div>

        {/* Right Side: Highlight Box */}
        <div className="p-6 border-2 border-purple-700 bg-purple-50 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-purple-800 mb-2">Implementing tools & ability to see</h2>
          <p className="text-purple-600">AI see, analyze given data and use real life tools</p>
        </div>
      </section>

    </div>
  );
}

export default AIInvestorSlide