'use client';

import { useState } from 'react';

export function QuizCard({ question }: { question: any }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-56 cursor-pointer perspective"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full duration-500 transition-transform transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full bg-white border p-4 rounded-lg shadow z-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h3 className="font-semibold text-lg">{question.question}</h3>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {Array.isArray(question.options) &&
              question.options.map((opt: string, i: number) => (
                <li key={i}>{opt}</li>
              ))}
          </ul>
          <p className="text-sm text-gray-400 mt-4">Click to reveal answer ➡</p>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full bg-green-100 border p-4 rounded-lg shadow rotate-y-180"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="font-semibold">✅ Answer: {question.answer}</p>
          <p className="mt-2 text-sm text-gray-800">{question.explanation}</p>
          <p className="text-sm text-gray-400 mt-4">Click again to flip back 🔄</p>
        </div>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

