'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  Book,
  Mic,
  Dumbbell,
  Video,
  Headphones,
  Rocket,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
  Play,
  ChevronRight,
  Trophy,
  Star,
  X,
  ArrowLeft
} from 'lucide-react';
import Markdown from 'react-markdown';

// Type Definitions
interface Step {
  id: number;
  title: string;
  objective: string;
  completed?: boolean;
  todos?: Todo[];
}

interface Todo {
  task: string;
  completed: boolean;
}

const ModernLearningPath: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState<Step[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]); // Todos for the *actual* current step
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStepIndex, setModalStepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDesktopStepIndex, setActiveDesktopStepIndex] = useState<number | null>(null); // New state for desktop
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- API Calls ---
  const generateRoadmap = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/duo-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (response.ok) {
        // Assign IDs to roadmap steps, starting from 0
        const newRoadmap = data.roadmap.map((step: Omit<Step, 'id'>, index: number) => ({ ...step, id: index }));
        setRoadmap(newRoadmap);
        setCurrentStepIndex(0);
        setCompletedSteps([]);
        setTodos([]);
        setActiveDesktopStepIndex(0); // Set active desktop step to the first one
      } else {
        console.error('API Error (Roadmap):', data.error);
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
    setIsGenerating(false);
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/duo-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          stepTitle: roadmap[currentStepIndex].title,
          // Pass full completedSteps data to give context to the AI
          completedSteps: completedSteps.map(step => ({
            id: step.id,
            title: step.title,
            todos: step.todos // Include tasks of completed steps
          })),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTodos(data.todos);
      } else {
        console.error('API Error (Tasks):', data.error);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setIsLoading(false);
  };
  // --- End API Calls ---


  useEffect(() => {
    if (currentStepIndex < roadmap.length && roadmap.length > 0) {
      fetchTodos();
    }
  }, [currentStepIndex, roadmap]); // topic removed from dependencies to avoid re-fetching on topic change

  const handleStepClick = (stepIndex: number) => {
    const isUpcoming = stepIndex > currentStepIndex;
    if (isUpcoming) return; // Prevent clicking upcoming steps

    if (isMobile) {
      // On mobile, always open modal for completed or current steps
      setModalStepIndex(stepIndex);
      setShowModal(true);
    } else {
      // On desktop, set the active step to show its tasks
      setActiveDesktopStepIndex(stepIndex);
      // If the clicked step is the current one, its tasks are handled by useEffect
      // If it's a completed step, displayTodos will pick it up from completedSteps
    }
  };

  // This function is now explicitly called by the "Complete Step" button
  const handleCompleteCurrentStep = (stepIndex: number) => {
    // Only allow completing the *actual* current step
    if (stepIndex !== currentStepIndex) return;

    const currentStep = {
      ...roadmap[stepIndex],
      todos: todos.map((t) => ({ ...t, completed: true })), // Use the latest 'todos' state
      completed: true
    };

    setCompletedSteps((prev) => [...prev, currentStep]);
    setTodos([]); // Clear todos for the current view

    if (stepIndex + 1 < roadmap.length) {
      setCurrentStepIndex(stepIndex + 1);
      setActiveDesktopStepIndex(stepIndex + 1); // Also update active desktop step
    } else {
      setActiveDesktopStepIndex(null); // No active step if roadmap is complete
    }
    setShowModal(false); // Close modal if current step is completed
  };

  const handleTodoChange = (todoIndex: number, stepIndex: number, isModalContext: boolean) => {
    // This function handles checkbox changes for current step tasks
    if (stepIndex === currentStepIndex) {
      const updatedTodos = [...todos];
      updatedTodos[todoIndex].completed = !updatedTodos[todoIndex].completed;
      setTodos(updatedTodos);
    }
    // Completed steps are now read-only, so no modification logic is needed here for them.
  };

  const TodoTask: React.FC<{
    todos: Todo[];
    onAllCompleted: (stepIndex: number) => void;
    stepIndex: number;
    isModal?: boolean;
    onTodoChange: (todoIndex: number, stepIndex: number, isModalContext: boolean) => void;
    isReadOnly: boolean;
    isMobile?: boolean; // For button text
  }> = ({ todos, onAllCompleted, stepIndex, isModal = false, onTodoChange, isReadOnly, isMobile = false }) => {
    const [taskStates, setTaskStates] = useState(todos.map((todo) => ({ ...todo })));
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
      // Update internal state when 'todos' prop changes
      setTaskStates(todos.map((todo) => ({ ...todo })));
    }, [todos, isReadOnly]);

    const handleCheckboxChange = (index: number) => {
      if (isReadOnly) return; // Prevent changes if read-only

      onTodoChange(index, stepIndex, isModal);

      // This part now only triggers celebration, not auto-advance
      const updatedTasks = [...taskStates];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      const allCompleted = updatedTasks.every((task) => task.completed);
      if (allCompleted && !showCelebration) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          // Don't call onAllCompleted here. It's called by the button.
        }, 1500);
      }
    };

    const completedCount = taskStates.filter((t) => t.completed).length;
    const allTasksCompleted = taskStates.length > 0 && completedCount === taskStates.length;
    const progress = (completedCount / taskStates.length) * 100;

    return (
      <div className="relative">
        <div className={`bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 ${isModal ? 'w-full' : 'w-80'} relative overflow-hidden`}>
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center z-50">
              <div className="text-center animate-bounce">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-700">Well Done! 🎉</p>
              </div>
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Your Tasks
              </h3>
              <div className="text-sm font-medium text-gray-600">
                {completedCount}/{taskStates.length}
              </div>
            </div>
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
            </div>
            <ul className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
              {taskStates.map((todo, index) => (
                <li key={index} className="group">
                  <label className={`flex items-start cursor-pointer p-2 rounded-lg transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-70' : 'hover:bg-white/50'}`}>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleCheckboxChange(index)}
                        className="sr-only"
                        disabled={isReadOnly}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? 'bg-gradient-to-r from-green-400 to-blue-500 border-green-400'
                          : isReadOnly
                            ? 'bg-gray-100 border-gray-200'
                            : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {todo.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <div className={`ml-3 text-sm leading-relaxed transition-all duration-200 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : isReadOnly
                          ? 'text-gray-500'
                          : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      <Markdown>{todo.task}</Markdown>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            {/* Show "Complete Step" button only if all tasks are complete, no celebration, and NOT read-only */}
            {allTasksCompleted && !showCelebration && !isReadOnly && (
              <button
                onClick={() => onAllCompleted(stepIndex)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {isMobile ? "Finish Step" : "Complete Step"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {/* If read-only and all completed, optionally show a "Completed" indicator */}
            {isReadOnly && allTasksCompleted && (
                 <div className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Step Completed
                 </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal Component
  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; stepIndex: number }> = ({ isOpen, onClose, stepIndex }) => {
    if (!isOpen || stepIndex >= roadmap.length) return null;

    const step = roadmap[stepIndex];
    const isCompletedStep = completedSteps.some(s => s.id === step.id);
    const completedStepData = completedSteps.find(s => s.id === step.id);
    const isCurrentStep = stepIndex === currentStepIndex;

    const modalTodos = isCompletedStep && completedStepData?.todos ? completedStepData.todos :
                       isCurrentStep ? todos : [];

    const isReadOnlyModal = isCompletedStep;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">{step.title}</h2>
                  <p className="text-sm text-gray-600">{step.objective}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {isLoading && isCurrentStep ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className="text-gray-600 font-medium">Generating tasks...</span>
                </div>
              </div>
            ) : modalTodos.length > 0 ? (
              <TodoTask
                todos={modalTodos}
                onAllCompleted={handleCompleteCurrentStep}
                stepIndex={stepIndex}
                isModal={true}
                onTodoChange={handleTodoChange}
                isReadOnly={isReadOnlyModal}
                isMobile={true}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks available for this step.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DesktopLearningPath: React.FC<{ steps: Step[] }> = ({ steps }) => {
    const nodeSpacing = 160;
    const containerHeight = steps.length * nodeSpacing + 300;
    const icons = [Book, Mic, Dumbbell, Video, Headphones];
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-green-500 to-teal-600',
      'from-yellow-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-violet-600',
    ];

    const displayStepIndex = activeDesktopStepIndex !== null ? activeDesktopStepIndex : currentStepIndex;
    const displayTodos = displayStepIndex !== null ?
      (displayStepIndex === currentStepIndex ? todos : completedSteps.find(s => s.id === roadmap[displayStepIndex].id)?.todos)
      : null;

    const isReadOnlyDesktop = displayStepIndex !== null && completedSteps.some(s => s.id === roadmap[displayStepIndex].id);

    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl"></div>
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl mx-auto py-8 px-4"
          style={{ minHeight: `${containerHeight}px` }}
        >
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 z-0 rounded-full"></div>

          {steps.map((step, index) => {
            const top = index * nodeSpacing + 60;
            const Icon = icons[index % icons.length];
            const color = colors[index % colors.length];
            const isCompleted = completedSteps.some(s => s.id === step.id);
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;
            const isActiveDesktop = index === displayStepIndex;

            return (
              <div
                key={step.id}
                className="absolute z-10 flex items-center transition-all duration-500"
                style={{ top: `${top}px`, left: '50%', transform: 'translateX(-50%)' }}
              >
                <div className="relative group">
                  <button
                    onClick={() => handleStepClick(index)}
                    className={`
                      relative z-20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl
                      transition-all duration-500 transform-gpu
                      ${isCompleted ? `bg-gradient-to-br ${color} shadow-colored` : isCurrent ? 'bg-white border-4 border-blue-400 shadow-blue-200' : 'bg-white border-2 border-gray-300'}
                      ${isCurrent ? 'scale-125 animate-pulse' : isCompleted ? 'scale-110' : 'scale-100'}
                      ${!isUpcoming ? 'hover:scale-115 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                      ${isActiveDesktop ? 'ring-4 ring-offset-2 ring-blue-300' : ''}
                      backdrop-blur-sm
                    `}
                    disabled={isUpcoming}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 animate-ping"></div>
                    )}
                    <Icon className={`w-7 h-7 z-10 ${isCompleted ? 'text-white' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </button>
                </div>

                <div className={`ml-6 transition-all duration-500 ${isActiveDesktop ? 'scale-110' : 'scale-100'}`}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 min-w-[200px]">
                    <h3 className={`font-bold text-left leading-tight ${isCompleted ? 'text-gray-800' : isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>
                      {step.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </>
                        ) : isCurrent ? (
                          <>
                            <Play className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Upcoming
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isActiveDesktop && displayTodos && (
                  <div className="absolute left-full ml-8 top-1/2 transform -translate-y-1/2 z-30">
                    {isLoading && displayStepIndex === currentStepIndex ? (
                      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 w-80">
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
                            <span className="text-gray-600 font-medium">Generating tasks...</span>
                          </div>
                        </div>
                      </div>
                    ) : displayTodos.length > 0 ? (
                      <TodoTask
                        todos={displayTodos}
                        onAllCompleted={handleCompleteCurrentStep}
                        stepIndex={displayStepIndex!}
                        onTodoChange={handleTodoChange}
                        isReadOnly={isReadOnlyDesktop}
                      />
                    ) : (
                      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-6 w-80 text-center text-gray-500">
                        No tasks available.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {currentStepIndex >= steps.length && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-40">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-8 shadow-2xl">
                <Trophy className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white mb-2">Congratulations! 🎉</h2>
                <p className="text-white/90">You've completed your {topic} learning path!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MobileLearningPath: React.FC<{ steps: Step[] }> = ({ steps }) => {
    const icons = [Book, Mic, Dumbbell, Video, Headphones];
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-green-500 to-teal-600',
      'from-yellow-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-violet-600',
    ];

    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = icons[index % icons.length];
          const color = colors[index % colors.length];
          const isCompleted = completedSteps.some(s => s.id === step.id);
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.id} className="relative">
              {index > 0 && (
                <div className="absolute left-8 -top-4 w-0.5 h-4 bg-gradient-to-b from-gray-300 to-transparent"></div>
              )}

              <div
                className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 transition-all duration-300 ${
                  !isUpcoming ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : 'opacity-60'
                }`}
                onClick={() => !isUpcoming && handleStepClick(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg
                    transition-all duration-300
                    ${isCompleted ? `bg-gradient-to-br ${color}` : isCurrent ? 'bg-white border-4 border-blue-400' : 'bg-white border-2 border-gray-300'}
                    ${isCurrent ? 'animate-pulse' : ''}
                  `}>
                    <Icon className={`w-7 h-7 ${isCompleted ? 'text-white' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold text-lg leading-tight ${
                      isCompleted ? 'text-gray-800' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{step.objective}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isCompleted ? 'bg-green-100 text-green-700' :
                        isCurrent ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </>
                        ) : isCurrent ? (
                          <>
                            <Play className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Upcoming
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {(isCompleted || isCurrent) && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {currentStepIndex >= steps.length && (
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 shadow-2xl">
              <Trophy className="w-12 h-12 text-white mx-auto mb-4 animate-bounce" />
              <h2 className="text-xl font-bold text-white mb-2">Congratulations! 🎉</h2>
              <p className="text-white/90">You've completed your {topic} learning path!</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Rocket className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Learning Adventure
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4">
            Transform any topic into a personalized learning journey with AI-powered guidance and interactive tasks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="flex-1 p-3 md:p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/90 text-sm md:text-base"
                placeholder="Enter any topic (e.g., Web Development, Machine Learning)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateRoadmap()}
              />
              <button
                onClick={generateRoadmap}
                disabled={isGenerating || !topic.trim()}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 md:w-5 h-5" />
                    Generate Path
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {roadmap.length > 0 && (
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl border border-white/50 p-4 md:p-6">
            {isMobile ? (
              <MobileLearningPath steps={roadmap} />
            ) : (
              <DesktopLearningPath steps={roadmap} />
            )}
          </div>
        )}

        {roadmap.length === 0 && !isGenerating && (
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-6">Try these popular topics:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Web Development', 'Machine Learning', 'Finance'].map((suggestedTopic) => (
                <button
                  key={suggestedTopic}
                  onClick={() => {
                    setTopic(suggestedTopic);
                    setTimeout(() => generateRoadmap(), 100);
                  }}
                  className="px-4 md:px-6 py-2 md:py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl hover:bg-white/90 transition-all duration-200 font-medium text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  {suggestedTopic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          stepIndex={modalStepIndex}
        />
      )}
    </div>
  );
};

export default ModernLearningPath;
