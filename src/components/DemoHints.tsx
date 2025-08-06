import { useState, useEffect } from "react";
import { X, HelpCircle, CheckCircle, MousePointer, Users, FileText, Shield } from "lucide-react";

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
    action: () => {
      // This will be handled by the component state
      window.dispatchEvent(new CustomEvent('showHighlightTutorial'));
    },
    actionText: "Try now",
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
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Try Text Highlighting
                </h3>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">How to highlight text:</h4>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">1</span>
                    <span>Click any transcript to expand it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">2</span>
                    <span>Select any text with your mouse/finger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">3</span>
                    <span>Click "Share Link" in the tooltip</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">4</span>
                    <span>Share the copied link with anyone!</span>
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 text-sm font-medium">Try it now!</p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Close this popup and try highlighting text in any transcript below.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Got it, let me try!
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
      `}</style>
    </>
  );
}
