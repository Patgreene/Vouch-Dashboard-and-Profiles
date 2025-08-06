import { useState } from "react";
import { X, HelpCircle, CheckCircle, MousePointer, Users, FileText, Shield } from "lucide-react";

interface Hint {
  id: string;
  title: string;
  description: string;
  position: { top: string; left: string };
  icon: React.ComponentType<any>;
  action?: () => void;
  actionText?: string;
}

const hints: Hint[] = [
  {
    id: "profile-overview",
    title: "Professional Profile",
    description: "This is Lara's Vouch profile showcasing verified testimonials and key insights from colleagues.",
    position: { top: "120px", left: "50%" },
    icon: Users,
  },
  {
    id: "key-takeaways",
    title: "Key Takeaways",
    description: "AI-extracted insights from all testimonials showing strengths, challenges, and working style.",
    position: { top: "320px", left: "20px" },
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
    position: { top: "480px", left: "80px" },
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
    position: { top: "600px", left: "60%" },
    icon: MousePointer,
  },
  {
    id: "given-received",
    title: "Two-Way Testimonials",
    description: "See testimonials Lara received AND ones she's given to others - complete professional picture.",
    position: { top: "440px", left: "70%" },
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
        
        if (isCompleted) return null;

        return (
          <div key={hint.id} className="fixed z-50" style={hint.position}>
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
                style={{
                  transform: hint.position.left === "50%" ? "translateX(-50%)" : "none",
                }}
              >
                <HelpCircle className="w-4 h-4" />
                
                {/* Subtle pulse animation */}
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
              </button>

              {/* Expanded Hint Card */}
              {isActive && (
                <div 
                  className={`
                    absolute mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200
                    transform transition-all duration-300 ease-out
                    ${hint.position.left === "50%" ? "left-1/2 -translate-x-1/2" : 
                      hint.position.left === "70%" || hint.position.left === "60%" ? "right-0" : "left-0"}
                    z-10
                  `}
                  style={{
                    animation: "fadeInUp 0.3s ease-out",
                  }}
                >
                  {/* Arrow */}
                  <div 
                    className={`
                      absolute -top-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200
                      ${hint.position.left === "50%" ? "left-1/2 -translate-x-1/2" : 
                        hint.position.left === "70%" || hint.position.left === "60%" ? "right-4" : "left-4"}
                    `}
                  />
                  
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
                    <div className="flex items-center justify-between">
                      {hint.action && hint.actionText && (
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
                      )}
                      
                      <button
                        onClick={() => handleDismiss(hint.id)}
                        className="
                          flex items-center gap-1 px-2 py-1.5
                          text-gray-500 hover:text-gray-700 text-xs
                          transition-colors duration-200
                        "
                      >
                        <CheckCircle className="w-3 h-3" />
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

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
