"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";

export interface CodeComparisonProps {
  title?: string;
  description?: string;
  oldCode: {
    title: string;
    code: string;
    language?: string;
    pros?: string[];
    cons?: string[];
  };
  newCode: {
    title: string;
    code: string;
    language?: string;
    pros?: string[];
    cons?: string[];
  };
}

export function CodeComparison({
  title,
  description,
  oldCode,
  newCode,
}: CodeComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            Code Comparison
          </Badge>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
        </div>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="split" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="old">Old Way Only</TabsTrigger>
            <TabsTrigger value="new">New Way Only</TabsTrigger>
          </TabsList>

          {/* Split View */}
          <TabsContent value="split">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old Code */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300">
                    {oldCode.title}
                  </Badge>
                </div>
                <CodeBlock code={oldCode.code} language={oldCode.language} />
                {(oldCode.pros || oldCode.cons) && (
                  <div className="space-y-2 text-sm">
                    {oldCode.pros && oldCode.pros.length > 0 && (
                      <div>
                        <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                          ✓ Pros:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {oldCode.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {oldCode.cons && oldCode.cons.length > 0 && (
                      <div>
                        <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                          ✗ Cons:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {oldCode.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* New Code */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300">
                    {newCode.title}
                  </Badge>
                </div>
                <CodeBlock code={newCode.code} language={newCode.language} />
                {(newCode.pros || newCode.cons) && (
                  <div className="space-y-2 text-sm">
                    {newCode.pros && newCode.pros.length > 0 && (
                      <div>
                        <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                          ✓ Pros:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {newCode.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {newCode.cons && newCode.cons.length > 0 && (
                      <div>
                        <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                          ✗ Cons:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {newCode.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Old Way Only */}
          <TabsContent value="old">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300">
                  {oldCode.title}
                </Badge>
              </div>
              <CodeBlock code={oldCode.code} language={oldCode.language} />
              {(oldCode.pros || oldCode.cons) && (
                <div className="space-y-2 text-sm">
                  {oldCode.pros && oldCode.pros.length > 0 && (
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                        ✓ Pros:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {oldCode.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {oldCode.cons && oldCode.cons.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                        ✗ Cons:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {oldCode.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* New Way Only */}
          <TabsContent value="new">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300">
                  {newCode.title}
                </Badge>
              </div>
              <CodeBlock code={newCode.code} language={newCode.language} />
              {(newCode.pros || newCode.cons) && (
                <div className="space-y-2 text-sm">
                  {newCode.pros && newCode.pros.length > 0 && (
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                        ✓ Pros:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {newCode.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {newCode.cons && newCode.cons.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                        ✗ Cons:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                        {newCode.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
