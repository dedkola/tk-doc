import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

function stripReactRules(config) {
  if (!config.rules) {
    return config;
  }

  const rules = Object.fromEntries(
    Object.entries(config.rules).filter(
      ([ruleName]) => !ruleName.startsWith("react/"),
    ),
  );

  return {
    ...config,
    rules,
  };
}

const eslintConfig = defineConfig([
  // `eslint-plugin-react` in the current Next preset crashes with `eslint@10`.
  // Keep the rest of the preset active until the dependency stack is pinned back.
  ...nextVitals.map(stripReactRules),
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
