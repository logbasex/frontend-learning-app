// Module content registry
import { Module_1_1_Content } from "./1-1-html-css";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-html-css": Module_1_1_Content,
  // More modules will be added here
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
