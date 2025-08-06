import { useState, useEffect } from "react";
import { X, HelpCircle, CheckCircle, MousePointer, Users, FileText, Shield, Share2 } from "lucide-react";

interface Hint {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  offsetX?: number;
  offsetY?: number;
  icon: React.ComponentType<any>;
  action?: () => void;
  actionText?: string;
}

const hints: Hint[] = [
  {
    id: "key-takeaways",
    title: "Key Takeaways",
    description: "AI-extracted insights from all testimonials showing strengths, challenges, and working style.",
    targetSelector: '[data-loc*="KeyTakeaways"]',
    offsetX: -30,
    offsetY: 20,
    icon: FileText,
    action: () => {
      const button = document.querySelector('[data-loc*="KeyTakeaways"] button') as HTMLButtonElement;
      if (button) button.click();
    },
    actionText: "Click to expand",
  },
  {
    id: "verification",
    title: "Verification System",
    description: "Green badges show professionally verified testimonials. Others can be verified for $19.",
    targetSelector: 'button:has(svg.lucide-shield)',
    offsetX: -10,
    offsetY: -15,
    icon: Shield,
    action: () => {
      const verifyButton = document.querySelector('button:has(svg.lucide-shield)') as HTMLButtonElement;
      if (verifyButton) verifyButton.click();
    },
    actionText: "Try verification",
  },
  {
    id: "text-highlighting",
    title: "Share Specific Quotes",
    description: "Select any text in testimonials to create shareable links to specific quotes.",
    targetSelector: '.space-y-4.sm\\:space-y-6 > div:first-child',
    offsetX: 20,
    offsetY: 100,
    icon: MousePointer,
  },
  {
    id: "given-received",
    title: "Two-Way Testimonials",
    description: "See who Vouched for Lara and vice versa - complete picture.",
    targetSelector: '[role="tablist"]',
    offsetX: 120,
    offsetY: 10,
    icon: Users,
    action: () => {
      const givenTab = document.querySelector('button[data-state="inactive"]') as HTMLButtonElement;
      if (givenTab) givenTab.click();
    },
    actionText: "View given testimonials",
  },
];

export function DemoHints() {
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [completedHints, setCompletedHints] = useState<Set<string>>(new Set());
  const [hintPositions, setHintPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [showTutorial, setShowTutorial] = useState(false);

  // Calculate positions based on target elements
  const updatePositions = () => {
    const newPositions: Record<string, { x: number; y: number }> = {};

    hints.forEach((hint) => {
      const element = document.querySelector(hint.targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        newPositions[hint.id] = {
          x: rect.left + scrollLeft + (hint.offsetX || 0),
          y: rect.top + scrollTop + (hint.offsetY || 0),
        };
      }
    });

    setHintPositions(newPositions);
  };

  // Update positions on mount and scroll
  useEffect(() => {
    const timer = setTimeout(updatePositions, 500); // Small delay to ensure DOM is ready

    const handleScroll = () => updatePositions();
    const handleResize = () => updatePositions();
    const handleShowTutorial = () => setShowTutorial(true);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('showHighlightTutorial', handleShowTutorial);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('showHighlightTutorial', handleShowTutorial);
    };
  }, []);

  const handleHintClick = (hint: Hint) => {
    if (hint.id === "text-highlighting") {
      // Show tutorial immediately for text highlighting
      setShowTutorial(true);
      return;
    }

    if (activeHint === hint.id) {
      setActiveHint(null);
      return;
    }
    setActiveHint(hint.id);
  };

  const handleAction = (hint: Hint) => {
    if (hint.action) {
      hint.action();
    }
    setCompletedHints(prev => new Set([...prev, hint.id]));
    setActiveHint(null);
  };

  const handleDismiss = (hintId: string) => {
    setCompletedHints(prev => new Set([...prev, hintId]));
    if (activeHint === hintId) {
      setActiveHint(null);
    }
  };

  return (
    <>
      {hints.map((hint) => {
        const isCompleted = completedHints.has(hint.id);
        const isActive = activeHint === hint.id;
        const position = hintPositions[hint.id];

        if (isCompleted || !position) return null;

        return (
          <div
            key={hint.id}
            className="absolute z-50"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          >
            {/* Hint Badge */}
            <div className="relative">
              <button
                onClick={() => handleHintClick(hint)}
                className={`
                  group relative
                  w-8 h-8 rounded-full
                  bg-gradient-to-r from-blue-500 to-blue-600
                  hover:from-blue-600 hover:to-blue-700
                  text-white shadow-lg hover:shadow-xl
                  transition-all duration-200 ease-out
                  transform hover:scale-110
                  border-2 border-white
                  flex items-center justify-center
                  ${isActive ? 'ring-4 ring-blue-200' : ''}
                `}

              >
                <HelpCircle className="w-4 h-4" />

                {/* Subtle pulse animation */}
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
              </button>

              {/* Expanded Hint Card */}
              {isActive && (
                <div
                  className="absolute mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 ease-out left-0 z-10"
                  style={{
                    animation: "fadeInUp 0.3s ease-out",
                  }}
                >
                  {/* Arrow */}
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200" />

                  <div className="relative bg-white rounded-xl p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <hint.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {hint.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDismiss(hint.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {hint.description}
                    </p>

                    {/* Actions */}
                    {hint.action && hint.actionText && (
                      <div className="flex justify-start">
                        <button
                          onClick={() => handleAction(hint)}
                          className="
                            flex items-center gap-2 px-3 py-1.5
                            bg-blue-600 hover:bg-blue-700
                            text-white text-xs font-medium rounded-lg
                            transition-colors duration-200
                          "
                        >
                          {hint.actionText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Text Highlighting Demo
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Only Animation */}
            <div className="p-6">
              {/* Animated Demo */}
              <div className="bg-gray-50 rounded-lg p-4 relative overflow-hidden">

                {/* Mini Demo Container */}
                <div className="bg-white rounded-lg border shadow-sm relative" style={{ height: '200px' }}>
                  {/* Step 1: Mock transcript card (collapsed) */}
                  <div className="absolute inset-2 demo-step-1">
                    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
                          <div className="flex-1">
                            <div className="text-xs font-medium">Clara Jensen</div>
                            <div className="text-xs text-gray-500">Product Designer</div>
                          </div>
                          <div className="relative">
                            {/* Down arrow with click indicator */}
                            <svg className="w-4 h-4 text-gray-500 demo-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <div className="absolute inset-0 w-8 h-8 -m-2 border-2 border-blue-500 rounded-full demo-click-indicator"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Lara's design process is incredibly methodical...
                        </div>
                      </div>

                      {/* Expandable content (initially hidden) */}
                      <div className="demo-expanded-content" style={{ height: '0px', overflow: 'hidden' }}>
                        <div className="px-3 pb-3">
                          <div className="text-xs text-gray-700 leading-relaxed">
                            Lara's <span className="demo-highlight">design process is incredibly methodical</span> and she creates detailed user journeys that make sense from both user and technical perspectives.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Share tooltip */}
                  <div className="absolute demo-step-3" style={{ top: '60px', left: '50%', transform: 'translateX(-50%)', opacity: 0 }}>
                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 cursor-pointer">
                      <Share2 className="w-3 h-3" />
                      Share Link
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                    </div>

                    {/* Click indicator */}
                    <div className="absolute inset-0 border-2 border-white rounded-lg animate-ping"></div>
                  </div>

                  {/* Step 4: Success feedback */}
                  <div className="absolute demo-step-4" style={{ top: '60px', left: '50%', transform: 'translateX(-50%)', opacity: 0 }}>
                    <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      Copied!
                    </div>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center mt-3 gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 demo-progress-1"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 demo-progress-2"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 demo-progress-3"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 demo-progress-4"></div>
                </div>
              </div>


            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Demo Animation Styles */
        .demo-step-1 { animation: none; } /* Always visible */
        .demo-expanded-content { animation: content-expand 8s infinite; }
        .demo-click-indicator { animation: click-pulse 8s infinite; }
        .demo-arrow { animation: arrow-rotate 8s infinite; }
        .demo-step-3 { animation: demo-step-3 8s infinite; }
        .demo-step-4 { animation: demo-step-4 8s infinite; }

        .demo-progress-1 { animation: progress-1 8s infinite; }
        .demo-progress-2 { animation: progress-2 8s infinite; }
        .demo-progress-3 { animation: progress-3 8s infinite; }
        .demo-progress-4 { animation: progress-4 8s infinite; }

        .demo-highlight { animation: highlight-fade 8s infinite; }

        @keyframes content-expand {
          0%, 20% { height: 0px; }
          25%, 100% { height: 60px; }
        }

        @keyframes click-pulse {
          0%, 15% { opacity: 0.7; transform: scale(1); }
          18% { opacity: 0; transform: scale(1.2); }
          20%, 100% { opacity: 0; transform: scale(1); }
        }

        @keyframes arrow-rotate {
          0%, 20% { transform: rotate(0deg); }
          25%, 100% { transform: rotate(180deg); }
        }

        @keyframes demo-step-3 {
          0%, 40% { opacity: 0; transform: translateX(-50%) translateY(10px); }
          45%, 65% { opacity: 1; transform: translateX(-50%) translateY(0); }
          70%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }

        @keyframes demo-step-4 {
          0%, 65% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          70%, 85% { opacity: 1; transform: translateX(-50%) scale(1); }
          90%, 100% { opacity: 0; transform: translateX(-50%) scale(1.1); }
        }

        @keyframes progress-1 {
          0%, 25% { background-color: #2563eb; }
          25%, 100% { background-color: #d1d5db; }
        }

        @keyframes progress-2 {
          0%, 25% { background-color: #d1d5db; }
          25%, 45% { background-color: #2563eb; }
          45%, 100% { background-color: #d1d5db; }
        }

        @keyframes progress-3 {
          0%, 40% { background-color: #d1d5db; }
          40%, 65% { background-color: #2563eb; }
          65%, 100% { background-color: #d1d5db; }
        }

        @keyframes progress-4 {
          0%, 65% { background-color: #d1d5db; }
          65%, 100% { background-color: #2563eb; }
        }

        @keyframes highlight-fade {
          0%, 30% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 0%, transparent 0%, transparent 100%);
          }
          35% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 20%, transparent 20%, transparent 100%);
          }
          40% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 40%, transparent 40%, transparent 100%);
          }
          45% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 60%, transparent 60%, transparent 100%);
          }
          50% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 80%, transparent 80%, transparent 100%);
          }
          55%, 100% {
            background: linear-gradient(to right, #fef3c7 0%, #fef3c7 100%, transparent 100%, transparent 100%);
          }
        }
      `}</style>
    </>
  );
}
