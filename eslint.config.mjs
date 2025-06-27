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
      // Disable TypeScript strict rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off", 
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-function": "off",
      
      // Disable React Hook dependency warnings
      "react-hooks/exhaustive-deps": "off",
      
      // Allow console logs
      "no-console": "off",
      
      // Disable other potentially problematic rules
      "prefer-const": "off",
      "no-var": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off"
    }
  }
];

export default eslintConfig;
