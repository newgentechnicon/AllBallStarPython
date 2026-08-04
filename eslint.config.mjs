import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // These components intentionally synchronize local form state with
      // navigation data and server-provided edit data.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
