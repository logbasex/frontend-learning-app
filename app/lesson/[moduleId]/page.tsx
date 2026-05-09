"use client";

import { useParams, useRouter } from "next/navigation";
import { getModuleById, getNextModule, getPreviousModule } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { getModuleContent } from "@/lib/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Home, Check, BookMarked, Clock } from "lucide-react";
import React, { useEffect } from "react";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const moduleData = getModuleById(moduleId);
  const nextModule = getNextModule(moduleId);
  const previousModule = getPreviousModule(moduleId);

  const { completedModules, markModuleComplete, setCurrentModule, toggleBookmark, bookmarkedModules } =
    useProgress();

  const isCompleted = completedModules.includes(moduleId);
  const isBookmarked = bookmarkedModules.includes(moduleId);

  const moduleContent = getModuleContent(moduleId);

  useEffect(() => {
    if (moduleId) {
      setCurrentModule(moduleId);
    }
  }, [moduleId, setCurrentModule]);

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg">Module not found!</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleComplete = () => {
    markModuleComplete(moduleId);
    if (nextModule) {
      router.push(`/lesson/${nextModule.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBookmark(moduleId)}
              >
                <BookMarked className="w-4 h-4 mr-2" />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              {isCompleted && (
                <Badge className="bg-green-500">
                  <Check className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Module Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-3">
                Phase {moduleData.phase}
              </Badge>
              <h1 className="text-4xl font-bold mb-3">{moduleData.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {moduleData.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {moduleData.duration}
                </div>
                <div className="flex gap-1">
                  {moduleData.hasInteractiveDemo && <Badge variant="outline" className="text-xs">Live Code</Badge>}
                  {moduleData.hasDiagram && <Badge variant="outline" className="text-xs">Diagram</Badge>}
                  {moduleData.hasChallenge && <Badge variant="outline" className="text-xs">Challenge</Badge>}
                  {moduleData.hasCodeComparison && <Badge variant="outline" className="text-xs">Comparison</Badge>}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Learning Objectives */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">🎯 After completing this lesson you will:</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {moduleData.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            {/* Mental Models */}
            <div>
              <h3 className="font-semibold mb-2">🧠 Mental Models:</h3>
              <div className="flex flex-wrap gap-2">
                {moduleData.mentalModels.map((model, index) => (
                  <Badge key={index} variant="secondary">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Module Content */}
        {moduleContent ? (
          React.createElement(moduleContent)
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Detailed content for <strong>{moduleData.title}</strong> is on the way.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                See the reference module <code>1-1-how-the-internet-works</code> for the full template.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                {previousModule ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/lesson/${previousModule.id}`)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous: {previousModule.title}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => router.push("/")}>
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {!isCompleted && (
                  <Button onClick={handleComplete} size="lg">
                    <Check className="w-4 h-4 mr-2" />
                    Complete and Continue
                  </Button>
                )}
                {isCompleted && nextModule && (
                  <Button
                    onClick={() => router.push(`/lesson/${nextModule.id}`)}
                    size="lg"
                  >
                    Next: {nextModule.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
