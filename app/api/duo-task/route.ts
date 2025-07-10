// api/duo-task/route.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { topic, stepTitle, completedSteps } = await req.json();

    const completedString = completedSteps.length > 0
      ? `You have already completed the following steps: ${completedSteps.map((step: any) => {
          const todoTasks = step.todos ? step.todos.map((t: any) => t.task.replace(/\*\*/g, '').replace(/[\*_`]/g, '')).join(', ') : ''; // Clean markdown for context
          return `"${step.title}" (including tasks: ${todoTasks})`;
        }).join('; ')}. `
      : '';

    const prompt = `
      You are an expert guide, generating highly specific, non-repetitive, and actionable tasks for a learning path.
      Generate a unique and practical todo list for learning "${topic}" specifically for the step "${stepTitle}".

      ${completedString}

      Each task should provide genuine, real-world advice on how to accomplish something related to "${stepTitle}".
      Do NOT suggest tasks that have been explicitly mentioned in the "completed steps" context.
      Ensure the tasks are distinct and build progressively.
      Include 2-3 relevant, specific tasks. Examples of real-world advice include:
      - Watch a certain specific YouTube video or playlist (e.g., "**Watch 'HTML Crash Course' by Traversy Media** on YouTube").
      - Read a specific book or chapter (e.g., "**Read Chapter 3 of 'Eloquent JavaScript'** focusing on functions").
      - Do a specific interactive tutorial or exercise on a known platform (e.g., "**Complete 'Flexbox Froggy' game** on flexboxfroggy.com").
      - How to search for and learn something on their own (e.g., "**Search Google for 'best practices for CSS naming conventions'** and summarize 3 key takeaways").
      - Engage in a practical, hands-on activity (e.g., "**Build a simple personal portfolio page** using only HTML and CSS").

      **Crucially, format the content of each 'task' string using Markdown (e.g., bolding with **, links with [], lists with -, etc.) to make it clear and engaging.**

      This should work for ANY topic, technical or non-technical. If the topic is non-technical (e.g., "how to talk to crush"), provide equally practical and actionable social/personal development advice.

      Output as a JSON array of objects like:
      [
        { "task": "## Learn about **HTML Basics**\n- Understand **tags** and **attributes**.\n- Check out [MDN Web Docs on HTML](https://developer.mozilla.org/en-US/docs/Web/HTML).", "completed": false },
        { "task": "### Explore CSS Styling\n- Grasp **selectors** and **properties**.\n- Practice with [CSS-Tricks](https://css-tricks.com/) tutorials.", "completed": false }
      ]
    `;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt,
      temperature: 0.7,
    });

    const jsonString = text.slice(text.indexOf('['), text.lastIndexOf(']') + 1);
    const json = JSON.parse(jsonString);
    return NextResponse.json({ todos: json });
  } catch (err) {
    console.error('Error generating tasks:', err);
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 });
  }
}