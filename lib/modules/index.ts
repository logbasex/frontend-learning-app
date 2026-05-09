import React from "react";

import { Module_1_1_Content } from "./1-1-how-the-internet-works";
import { Module_1_2_Content } from "./1-2-http-and-https";
import { Module_1_3_Content } from "./1-3-domain-dns-hosting";
import { Module_1_4_Content } from "./1-4-browsers-and-rendering";
import { Module_2_1_Content } from "./2-1-html-basics-and-semantics";
import { Module_2_2_Content } from "./2-2-forms-and-validation";
import { Module_2_3_Content } from "./2-3-accessibility";
import { Module_2_4_Content } from "./2-4-seo-basics";
import { Module_3_1_Content } from "./3-1-css-fundamentals";
import { Module_3_2_Content } from "./3-2-flexbox-and-grid";
import { Module_3_3_Content } from "./3-3-responsive-design";
import { Module_3_4_Content } from "./3-4-writing-css-modern";
import { Module_3_5_Content } from "./3-5-css-architecture-and-preprocessors";
import { Module_4_1_Content } from "./4-1-javascript-fundamentals";
import { Module_4_2_Content } from "./4-2-dom-and-events";
import { Module_4_3_Content } from "./4-3-fetch-and-async";
import { Module_5_1_Content } from "./5-1-git-and-github";
import { Module_5_2_Content } from "./5-2-package-managers";
import { Module_5_3_Content } from "./5-3-pick-a-framework";
import { Module_5_4_Content } from "./5-4-typescript";
import { Module_6_1_Content } from "./6-1-linters-and-formatters";
import { Module_6_2_Content } from "./6-2-module-bundlers";
import { Module_6_3_Content } from "./6-3-testing";
import { Module_6_4_Content } from "./6-4-authentication";
import { Module_6_5_Content } from "./6-5-web-security";
import { Module_7_1_Content } from "./7-1-web-components";
import { Module_7_2_Content } from "./7-2-ssr";
import { Module_7_3_Content } from "./7-3-graphql";
import { Module_7_4_Content } from "./7-4-static-site-generators";
import { Module_7_5_Content } from "./7-5-pwas-and-browser-apis";
import { Module_7_6_Content } from "./7-6-mobile-apps";
import { Module_7_7_Content } from "./7-7-desktop-apps";
import { Module_7_8_Content } from "./7-8-performance";

export const MODULE_CONTENTS: Record<string, React.ComponentType> = {
  "1-1-how-the-internet-works": Module_1_1_Content,
  "1-2-http-and-https": Module_1_2_Content,
  "1-3-domain-dns-hosting": Module_1_3_Content,
  "1-4-browsers-and-rendering": Module_1_4_Content,
  "2-1-html-basics-and-semantics": Module_2_1_Content,
  "2-2-forms-and-validation": Module_2_2_Content,
  "2-3-accessibility": Module_2_3_Content,
  "2-4-seo-basics": Module_2_4_Content,
  "3-1-css-fundamentals": Module_3_1_Content,
  "3-2-flexbox-and-grid": Module_3_2_Content,
  "3-3-responsive-design": Module_3_3_Content,
  "3-4-writing-css-modern": Module_3_4_Content,
  "3-5-css-architecture-and-preprocessors": Module_3_5_Content,
  "4-1-javascript-fundamentals": Module_4_1_Content,
  "4-2-dom-and-events": Module_4_2_Content,
  "4-3-fetch-and-async": Module_4_3_Content,
  "5-1-git-and-github": Module_5_1_Content,
  "5-2-package-managers": Module_5_2_Content,
  "5-3-pick-a-framework": Module_5_3_Content,
  "5-4-typescript": Module_5_4_Content,
  "6-1-linters-and-formatters": Module_6_1_Content,
  "6-2-module-bundlers": Module_6_2_Content,
  "6-3-testing": Module_6_3_Content,
  "6-4-authentication": Module_6_4_Content,
  "6-5-web-security": Module_6_5_Content,
  "7-1-web-components": Module_7_1_Content,
  "7-2-ssr": Module_7_2_Content,
  "7-3-graphql": Module_7_3_Content,
  "7-4-static-site-generators": Module_7_4_Content,
  "7-5-pwas-and-browser-apis": Module_7_5_Content,
  "7-6-mobile-apps": Module_7_6_Content,
  "7-7-desktop-apps": Module_7_7_Content,
  "7-8-performance": Module_7_8_Content,
};

export function getModuleContent(moduleId: string): React.ComponentType | null {
  return MODULE_CONTENTS[moduleId] || null;
}
