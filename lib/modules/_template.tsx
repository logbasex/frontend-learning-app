"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KeyTakeaways } from "@/components/KeyTakeaways";
import { Challenge, ChallengeOption } from "@/components/Challenge";
import { RoadmapLink } from "@/components/RoadmapLink";

export interface ScaffoldModuleProps {
  emoji: string;
  problemTitle: string;
  problem: ReactNode;
  body?: ReactNode;
  challenge: {
    question: string;
    options: ChallengeOption[];
    correctAnswerId: string;
    explanation: ReactNode;
  };
  takeaways: ReactNode[];
  mentalModel: string;
  roadmapUrl?: string;
}

export function ScaffoldModule({
  emoji,
  problemTitle,
  problem,
  body,
  challenge,
  takeaways,
  mentalModel,
  roadmapUrl,
}: ScaffoldModuleProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>
              {emoji} {problemTitle}
            </h2>
            {problem}
          </div>
          {roadmapUrl && (
            <div className="mt-4">
              <RoadmapLink url={roadmapUrl} />
            </div>
          )}
        </CardContent>
      </Card>
      {body}
      <Challenge
        question={challenge.question}
        options={challenge.options}
        correctAnswerId={challenge.correctAnswerId}
        explanation={challenge.explanation}
      />
      <KeyTakeaways points={takeaways} mentalModel={mentalModel} />
    </div>
  );
}
