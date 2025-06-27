import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**/*",
      "out/**/*",
      "node_modules/**/*",
      ".git/**/*",
      "dist/**/*",
      "build/**/*"
    ]
  },
  {
    rules: {
      // Disable or relax problematic rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn", 
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "warn",
      "react-hooks/exhaustive-deps": "warn",
      
      // Allow console logs in development
      "no-console": "warn",
      
      // Allow empty functions
      "@typescript-eslint/no-empty-function": "warn"
    }
  }
];

export default eslintConfig;
