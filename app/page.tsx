"use client";

import { curriculum, getStageProgress, getTotalProgress } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Globe,
  Zap,
  Wrench,
  Layers,
  Check,
  BookMarked,
  Clock,
  FileText,
  Map as MapIcon,
} from "lucide-react";

const ICONS = {
  FileText,
  Zap,
  Globe,
  Wrench,
  Layers,
  Map: MapIcon,
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
                Frontend, From First Principles
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                One real app, derived step by step. Each module exists because the previous one hit a wall.
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
                <h2 className="text-xl font-semibold mb-2">How this curriculum works</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Most frontend courses are catalogs: HTML, CSS, JavaScript, React, Next.js &mdash; one topic after another.
                  This one is a single derivation. You start with a text file, hit a wall, and every module exists because the previous module&apos;s world couldn&apos;t solve a real problem.
                  By the end you have built one real modern blog &mdash; the same app shows up in module 1 (broken), and grows one rung at a time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> First-principles derivation
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> One reference app, three rungs
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" /> Every module ships working code
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stages */}
        <div className="space-y-6">
          {curriculum.map((stage) => {
            const IconComponent = ICONS[stage.icon as keyof typeof ICONS] || Globe;
            const stageProgress = getStageProgress(stage.id, completedModules);
            const isStageComplete = stageProgress === 100;
            const isClosing = stage.id === 6;

            return (
              <Card key={stage.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Stage {stage.id}: {stage.title}
                          {isClosing && (
                            <Badge className="bg-violet-500 hover:bg-violet-600 text-xs">Closing</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{stage.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isStageComplete && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Check className="w-3 h-3 mr-1" /> Completed
                        </Badge>
                      )}
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
                        <p className="text-lg font-bold text-blue-600">{stageProgress}%</p>
                      </div>
                    </div>
                  </div>
                  <Progress value={stageProgress} className="mt-4" />
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stage.modules.map((moduleData) => {
                      const isCompleted = completedModules.includes(moduleData.id);
                      const recommendedPrereqs = moduleData.prerequisites.filter(
                        (p) => !completedModules.includes(p)
                      );
                      const hasRecommended = recommendedPrereqs.length > 0;

                      return (
                        <Link
                          key={moduleData.id}
                          href={`/lesson/${moduleData.id}`}
                          className="block"
                        >
                          <Card className={`h-full transition-all hover:shadow-lg hover:border-blue-300 ${
                            isCompleted ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20" : ""
                          }`}>
                            <CardHeader>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    {isCompleted && <Check className="w-4 h-4 text-green-600" />}
                                    {moduleData.title}
                                  </CardTitle>
                                </div>
                              </div>
                              <CardDescription className="text-sm line-clamp-2">
                                {moduleData.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {moduleData.duration}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-3">
                                {moduleData.hasInteractiveDemo && (
                                  <Badge variant="outline" className="text-xs">Live Code</Badge>
                                )}
                                {moduleData.hasDiagram && (
                                  <Badge variant="outline" className="text-xs">Diagram</Badge>
                                )}
                                {moduleData.hasChallenge && (
                                  <Badge variant="outline" className="text-xs">Challenge</Badge>
                                )}
                                {moduleData.hasCodeComparison && (
                                  <Badge variant="outline" className="text-xs">Comparison</Badge>
                                )}
                              </div>

                              <Button className="w-full mt-4" variant={isCompleted ? "secondary" : "default"}>
                                {isCompleted ? "Review" : "Start Learning"}
                              </Button>

                              {hasRecommended && !isCompleted && (
                                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                                  Recommended first: {recommendedPrereqs.length} earlier module{recommendedPrereqs.length === 1 ? "" : "s"}
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
          <p>Frontend, From First Principles &mdash; understand, then build</p>
          <p className="text-sm mt-2">Reference app: <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">examples/taproot-blog</code>. Built with Next.js, React, Sandpack, and Tailwind.</p>
        </div>
      </footer>
    </div>
  );
}
