import React from "react";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
