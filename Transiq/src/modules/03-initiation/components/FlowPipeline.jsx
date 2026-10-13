import React from 'react';

export default function FlowPipeline({ currentStep, isFailed }) {
  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Recipient' },
    { num: 3, label: 'Details' },
    { num: 4, label: 'Review and Confirm' },
    { num: 5, label: 'Security PIN' },
    { num: 6, label: 'Result' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-2xs mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[720px] max-w-full">
        {steps.map((step, idx) => {
          // Transaction ID generated in background; step 1 is Account Selection
          const isCompleted = step.num < currentStep || (currentStep === 6 && !isFailed);
          const isActive = step.num === currentStep && !(currentStep === 6 && isFailed);
          const isStepFailed = step.num === 6 && isFailed && currentStep === 6;

          return (
            <React.Fragment key={step.num}>
              {/* Step Node */}
              <div className="flex flex-col items-center flex-1 relative z-10 px-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                    isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                      : isStepFailed
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : isActive
                      ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {isCompleted ? '✓' : isStepFailed ? '✕' : step.num}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                    isCompleted
                      ? 'text-emerald-700'
                      : isStepFailed
                      ? 'text-rose-700 font-bold'
                      : isActive
                      ? 'text-slate-900 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded transition-colors ${
                    step.num < currentStep || (currentStep === 6 && !isFailed)
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
