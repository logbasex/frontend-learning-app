"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export interface ChallengeOption {
  id: string;
  text: string;
}

export interface ChallengeProps {
  question: string;
  options: ChallengeOption[];
  correctAnswerId: string;
  explanation: string;
  type?: "single" | "multiple";
  title?: string;
}

export function Challenge({
  question,
  options,
  correctAnswerId,
  explanation,
  type = "single",
  title,
}: ChallengeProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const isCorrect = selectedAnswer === correctAnswerId;

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <HelpCircle className="w-3 h-3 mr-1" />
            Challenge
          </Badge>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-semibold mb-4">{question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isThisCorrect = option.id === correctAnswerId;
            const showStatus = showExplanation;

            let borderColor = "border-slate-200 dark:border-slate-700";
            let bgColor = "bg-white dark:bg-slate-900";

            if (isSelected && !showStatus) {
              borderColor = "border-blue-500";
              bgColor = "bg-blue-50 dark:bg-blue-950/30";
            }

            if (showStatus && isThisCorrect) {
              borderColor = "border-green-500";
              bgColor = "bg-green-50 dark:bg-green-950/30";
            } else if (showStatus && isSelected && !isThisCorrect) {
              borderColor = "border-red-500";
              bgColor = "bg-red-50 dark:bg-red-950/30";
            }

            return (
              <button
                key={option.id}
                onClick={() => !showExplanation && setSelectedAnswer(option.id)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderColor} ${bgColor} ${
                  !showExplanation && "hover:border-blue-300 cursor-pointer"
                } ${showExplanation && "cursor-not-allowed"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option.text}</span>
                  {showStatus && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {showStatus && isSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit/Reset Button */}
        {!showExplanation && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full"
            size="lg"
          >
            Kiểm tra đáp án
          </Button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 space-y-4">
            {/* Result Badge */}
            <div className="flex items-center justify-center">
              {isCorrect ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-lg py-2 px-4">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Chính xác! 🎉
                </Badge>
              ) : (
                <Badge className="bg-red-500 hover:bg-red-600 text-lg py-2 px-4">
                  <XCircle className="w-5 h-5 mr-2" />
                  Chưa đúng, thử lại nhé!
                </Badge>
              )}
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                💡 Giải thích:
              </p>
              <p className="text-slate-700 dark:text-slate-300">{explanation}</p>
            </div>

            {/* Reset Button */}
            <Button onClick={handleReset} variant="outline" className="w-full">
              Thử lại
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
