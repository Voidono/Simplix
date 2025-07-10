import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  CalendarCheck,
  FileText,
  Music,
  Wind,
  Video,
  MessageSquareText, // Added for a more direct chat icon
  // Sparkles, // Added for a more engaging AI Companions icon
  Lightbulb,
  Bot,
  CircleDollarSign,
  HeartHandshake,
  Snail, // Added for a more reflective Care Tools icon
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming this is for utility classes
import Link from 'next/link';

const tools = [
  { name: "Find a real therapist", icon: CalendarCheck, href: "/therapists" },
  { name: "Write down", icon: FileText, href: "/journal" },
  { name: "Soothing Audio", icon: Music, href: "/soothing-audio" },
  { name: "Calm Breaths", icon: Wind, href: "/calm-breaths" },
  { name: "Join our community", icon: Video, href: "/community" },
];

const AppSidebar = () => {
  return (
    <Sidebar className="bg-gradient-to-b from-blue-50 to-white shadow-lg border-r border-blue-100">
      <SidebarHeader className="font-extrabold text-3xl text-blue-800">
        <Link href={'/'} className=' px-6 py-4 flex items-center gap-2'>
            {/* <Snail className="w-8 h-8 text-blue-500" /> */}
            Simplix AI
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto px-4">
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-2 ">
            <MessageSquareText className="w-4 h-4 text-gray-500" /> AI Companions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                {/* AI THERAPIST */}
                <SidebarMenuItem
                  className={cn(
                    "rounded-lg transition-all duration-200 ease-in-out !hover:bg-blue-300",
                  )}
                >
                  <SidebarMenuButton asChild>
                    <SidebarMenuButton asChild>
                    <Link href="/ai-therapist" className='h-20 bg-gray-200'>
                        <div className="flex items-center gap-3">
                        <HeartHandshake className="w-9 h-9 text-blue-500" />
                        <div className="flex flex-col text-left">
                            <span className="text-base font-semibold text-gray-800">AI therapist</span>
                            <span className="text-xs text-gray-500">
                            A safe place to share your thoughts and feelings
                            </span>
                        </div>
                        </div>
                    </Link>
                    </SidebarMenuButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* AI QUIZZING */}
                <SidebarMenuItem
                  className={cn(
                    "rounded-lg transition-all duration-200 ease-in-out !hover:bg-blue-300",
                  )}
                >
                  <SidebarMenuButton asChild>
                    <SidebarMenuButton asChild>
                    <Link href="/ai-quizz" className='h-20 bg-gray-200'>
                        <div className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-green-500" />
                        <div className="flex flex-col text-left">
                            <span className="text-base font-semibold text-gray-800">Quizz AI</span>
                            <span className="text-xs text-gray-500">
                            Let's learn by doing quizzes
                            </span>
                        </div>
                        </div>
                    </Link>
                    </SidebarMenuButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* AI INVESTOR */}
                <SidebarMenuItem
                  className={cn(
                    "rounded-lg transition-all duration-200 ease-in-out !hover:bg-blue-300",
                  )}
                >
                  <SidebarMenuButton asChild>
                    <SidebarMenuButton asChild>
                    <Link href="/ai-investor" className='h-20 bg-gray-200'>
                        <div className="flex items-center gap-3">
                        <CircleDollarSign className="w-6 h-6 text-purple-500" />
                        <div className="flex flex-col text-left">
                            <span className="text-base font-semibold text-gray-800">Investor AI</span>
                            <span className="text-xs text-gray-500">
                            Automate stock buying process
                            </span>
                        </div>
                        </div>
                    </Link>
                    </SidebarMenuButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-gray-500" /> If everyone is a superhero, then no one is.
          </SidebarGroupLabel>
          {/* <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem
                  key={tool.name}
                  className="rounded-lg transition-all duration-200 ease-in-out hover:bg-blue-100"
                >
                <Link href={tool.href}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-3 p-2">
                        <tool.icon className="w-6 h-6 text-blue-500" />
                        <span className="text-base font-medium text-gray-800">{tool.name}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent> */}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-xs text-gray-400 border-t border-blue-100 bg-white">
        © 2025 Apolumis. All rights reserved.
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar