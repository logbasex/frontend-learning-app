import React from "react";

import { PlaceholderModuleContent } from "./_placeholder";
import { Module_1_1_Content } from "./1-1-the-smallest-useful-thing";
import { Module_1_2_Content } from "./1-2-meaning-before-appearance";
import { Module_1_3_Content } from "./1-3-the-same-document-two-lives";
import { Module_2_1_Content } from "./2-1-when-the-page-has-to-react";
import { Module_2_2_Content } from "./2-2-things-take-time";
import { Module_2_3_Content } from "./2-3-talking-to-another-machine";
import { Module_3_1_Content } from "./3-1-the-journey-of-a-url";
import { Module_3_2_Content } from "./3-2-ship-it-and-version-it";
import { Module_4_1_Content } from "./4-1-the-dom-is-a-footgun-at-scale";
import { Module_4_2_Content } from "./4-2-types-and-the-editor-that-knows-them";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-the-smallest-useful-thing": Module_1_1_Content,
  "1-2-meaning-before-appearance": Module_1_2_Content,
  "1-3-the-same-document-two-lives": Module_1_3_Content,
  "2-1-when-the-page-has-to-react": Module_2_1_Content,
  "2-2-things-take-time": Module_2_2_Content,
  "2-3-talking-to-another-machine": Module_2_3_Content,
  "3-1-the-journey-of-a-url": Module_3_1_Content,
  "3-2-ship-it-and-version-it": Module_3_2_Content,
  "4-1-the-dom-is-a-footgun-at-scale": Module_4_1_Content,
  "4-2-types-and-the-editor-that-knows-them": Module_4_2_Content,
  "4-3-css-at-scale-collides": PlaceholderModuleContent,
  "5-1-routes-layouts-and-where-should-this-render": PlaceholderModuleContent,
  "5-2-data-state-and-who-owns-the-truth": PlaceholderModuleContent,
  "5-3-identity-and-trust": PlaceholderModuleContent,
  "6-1-the-field-from-here": PlaceholderModuleContent,
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
