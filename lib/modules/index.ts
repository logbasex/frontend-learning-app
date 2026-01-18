// Module content registry
import { Module_1_1_Content } from "./1-1-why-javafx";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-why-javafx": Module_1_1_Content,
  // More JavaFX modules will be added here
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
