import { ReactNode } from "react";

export interface ModuleSection {
  type: "text" | "playground" | "diagram" | "comparison" | "challenge" | "stepbystep";
  content: any;
}

export interface ModuleContent {
  moduleId: string;
  sections: ModuleSection[];
}
