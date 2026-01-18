"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export interface JavaFXDemoViewerProps {
  type: "screenshot" | "gif" | "video";
  src: string;
  alt: string;
  title?: string;
  description?: string;
  repoUrl?: string; // GitHub repo URL for runnable example
  width?: number;
  height?: number;
}

export function JavaFXDemoViewer({
  type,
  src,
  alt,
  title,
  description,
  repoUrl,
  width = 800,
  height = 600,
}: JavaFXDemoViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0); // For restarting GIF

  const handleReset = () => {
    setKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  const renderMedia = () => {
    switch (type) {
      case "screenshot":
        return (
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        );

      case "gif":
        return (
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <Image
              key={key}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto object-contain"
              unoptimized // GIFs need unoptimized to animate
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsPlaying(!isPlaying)}
                className="shadow-lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Play
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleReset}
                className="shadow-lg"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <video
              src={src}
              controls
              loop
              autoPlay
              muted
              className="w-full h-auto"
              style={{ maxHeight: height }}
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      {(title || description) && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-3 border-b">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {type === "screenshot"
                  ? "Screenshot"
                  : type === "gif"
                  ? "Demo Animation"
                  : "Video Demo"}
              </Badge>
              <h3 className="font-semibold">{title}</h3>
            </div>
          )}
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <CardContent className="p-4">
        {renderMedia()}

        {repoUrl && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  🏃 Run This Example
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  Clone and run the complete JavaFX application locally
                </p>
                <pre className="text-xs bg-slate-100 dark:bg-slate-900 p-2 rounded overflow-x-auto">
                  <code>
                    git clone {repoUrl}
                    {"\n"}cd {repoUrl.split("/").pop()}
                    {"\n"}mvn javafx:run
                  </code>
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="shrink-0"
              >
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Convenience component for screenshots
export function JavaFXScreenshot({
  src,
  alt,
  title,
  description,
  repoUrl,
}: Omit<JavaFXDemoViewerProps, "type">) {
  return (
    <JavaFXDemoViewer
      type="screenshot"
      src={src}
      alt={alt}
      title={title}
      description={description}
      repoUrl={repoUrl}
    />
  );
}

// Convenience component for animated GIFs
export function JavaFXAnimatedDemo({
  src,
  alt,
  title,
  description,
  repoUrl,
}: Omit<JavaFXDemoViewerProps, "type">) {
  return (
    <JavaFXDemoViewer
      type="gif"
      src={src}
      alt={alt}
      title={title}
      description={description}
      repoUrl={repoUrl}
    />
  );
}

// Convenience component for video demos
export function JavaFXVideoDemo({
  src,
  alt,
  title,
  description,
  repoUrl,
}: Omit<JavaFXDemoViewerProps, "type">) {
  return (
    <JavaFXDemoViewer
      type="video"
      src={src}
      alt={alt}
      title={title}
      description={description}
      repoUrl={repoUrl}
    />
  );
}
