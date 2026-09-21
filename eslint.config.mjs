import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Outil personnel indépendant du site, laissé tel quel.
    "app/naomi/**",
    "app/api/naomi/**",
    "lib/naomiSandbox.ts",
  ]),
]);

export default eslintConfig;
