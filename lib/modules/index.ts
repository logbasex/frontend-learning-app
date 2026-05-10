import React from "react";

import { PlaceholderModuleContent } from "./_placeholder";
import { Module_1_1_Content } from "./1-1-the-smallest-useful-thing";
import { Module_1_2_Content } from "./1-2-meaning-before-appearance";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-the-smallest-useful-thing": Module_1_1_Content,
  "1-2-meaning-before-appearance": Module_1_2_Content,
  "1-3-the-same-document-two-lives": PlaceholderModuleContent,
  "2-1-when-the-page-has-to-react": PlaceholderModuleContent,
  "2-2-things-take-time": PlaceholderModuleContent,
  "2-3-talking-to-another-machine": PlaceholderModuleContent,
  "3-1-the-journey-of-a-url": PlaceholderModuleContent,
  "3-2-ship-it-and-version-it": PlaceholderModuleContent,
  "4-1-the-dom-is-a-footgun-at-scale": PlaceholderModuleContent,
  "4-2-types-and-the-editor-that-knows-them": PlaceholderModuleContent,
  "4-3-css-at-scale-collides": PlaceholderModuleContent,
  "5-1-routes-layouts-and-where-should-this-render": PlaceholderModuleContent,
  "5-2-data-state-and-who-owns-the-truth": PlaceholderModuleContent,
  "5-3-identity-and-trust": PlaceholderModuleContent,
  "6-1-the-field-from-here": PlaceholderModuleContent,
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
