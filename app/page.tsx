"use client";

import { curriculum, getPhaseProgress, getTotalProgress } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Zap, Sparkles, Server, Layers, Lock, Check, BookMarked, Clock } from "lucide-react";

const ICONS = {
  Globe,
  Zap,
  Sparkles,
  Server,
  Layers,
};

export default function DashboardPage() {
  const { completedModules } = useProgress();
  const totalProgress = getTotalProgress(completedModules);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                JavaFX Learning Journey
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                From Fundamentals to Advanced Desktop GUI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Progress</p>
                <p className="text-2xl font-bold text-blue-600">{totalProgress}%</p>
              </div>
              <Progress value={totalProgress} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Intro Section */}
        <Card className="mb-8 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <BookMarked className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Welcome to the JavaFX Learning Path! 🖥️</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  This app is designed to help you understand the <strong>THINKING and PHILOSOPHY</strong> behind each technology.
                  Not just learning syntax, but understanding <em>why</em> the technology was created and <em>when</em> to use it.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Story-driven curriculum
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Interactive demos
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Mental models
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Real-world examples
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Phases */}
        <div className="space-y-6">
          {curriculum.map((phase) => {
            const IconComponent = ICONS[phase.icon as keyof typeof ICONS] || Globe;
            const phaseProgress = getPhaseProgress(phase.id, completedModules);
            const isPhaseComplete = phaseProgress === 100;

            return (
              <Card key={phase.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          Phase {phase.id}: {phase.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{phase.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isPhaseComplete && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Check className="w-3 h-3 mr-1" /> Completed
                        </Badge>
                      )}
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{phaseProgress}%</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={phaseProgress} className="mt-4" />
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {phase.modules.map((module) => {
                      const isCompleted = completedModules.includes(module.id);
                      const isUnlocked = module.prerequisites.every((prereq) =>
                        completedModules.includes(prereq)
                      ) || module.prerequisites.length === 0;

                      return (
                        <Link
                          key={module.id}
                          href={isUnlocked ? `/lesson/${module.id}` : "#"}
                          className={`block ${!isUnlocked && "pointer-events-none opacity-60"}`}
                        >
                          <Card className={`h-full transition-all hover:shadow-lg ${
                            isCompleted ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20" : ""
                          } ${!isUnlocked ? "border-slate-200 dark:border-slate-800" : "hover:border-blue-300"}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {isCompleted && <Check className="w-4 h-4 text-green-600" />}
                                    {!isUnlocked && <Lock className="w-4 h-4 text-slate-400" />}
                                    {module.title}
                                  </CardTitle>
                                </div>
                              </div>
                              <CardDescription className="text-sm line-clamp-2">
                                {module.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {module.duration}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-3">
                                {module.hasInteractiveDemo && (
                                  <Badge variant="outline" className="text-xs">Live Code</Badge>
                                )}
                                {module.hasDiagram && (
                                  <Badge variant="outline" className="text-xs">Diagram</Badge>
                                )}
                                {module.hasChallenge && (
                                  <Badge variant="outline" className="text-xs">Challenge</Badge>
                                )}
                                {module.hasCodeComparison && (
                                  <Badge variant="outline" className="text-xs">Comparison</Badge>
                                )}
                              </div>

                              {isUnlocked && (
                                <Button className="w-full mt-4" variant={isCompleted ? "secondary" : "default"}>
                                  {isCompleted ? "Review" : "Start Learning"}
                                </Button>
                              )}

                              {!isUnlocked && (
                                <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-600 dark:text-slate-400 text-center">
                                  Complete previous module to unlock
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>🖥️ JavaFX Learning App - Learn to understand, not just to do</p>
          <p className="text-sm mt-2">Built with Next.js, React, Tailwind CSS, and ❤️</p>
        </div>
      </footer>
    </div>
  );
}
