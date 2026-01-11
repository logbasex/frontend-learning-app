"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Play, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Step {
  title: string;
  description: string;
  code?: string;
  highlight?: string; // Code snippet to highlight
  visual?: React.ReactNode; // Custom visual component
}

export interface StepByStepExplanationProps {
  title: string;
  description?: string;
  steps: Step[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export function StepByStepExplanation({
  title,
  description,
  steps,
  autoPlay = false,
  autoPlayDelay = 3000,
}: StepByStepExplanationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // Loop back
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play effect
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        handleNext();
      }, autoPlayDelay);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  const currentStepData = steps[currentStep];

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-900">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-500 hover:bg-purple-600">
              Step-by-Step
            </Badge>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-400">
                {currentStepData.title}
              </h4>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Code snippet */}
            {currentStepData.code && (
              <div className="mb-4">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{currentStepData.code}</code>
                </pre>
              </div>
            )}

            {/* Visual component */}
            {currentStepData.visual && (
              <div className="mb-4">{currentStepData.visual}</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-purple-500"
                  : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-purple-300"
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            {autoPlay && (
              <Button
                variant={isPlaying ? "secondary" : "default"}
                size="sm"
                onClick={handlePlayPause}
              >
                <Play className="w-4 h-4" />
                {isPlaying ? "Pause" : "Play"}
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
