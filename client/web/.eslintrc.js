module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "plugin:react/recommended",
        "airbnb",
        "prettier"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "React": "readonly",
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2021,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react",
    ],
    "rules": {
      "no-use-before-define": "off",
      "no-shadow": "off",
      "no-param-reassign": ["error", { "props": false }],
      "no-restricted-syntax": 0,
      "no-unused-vars": "off",
      "no-continue": 0,
      "import/prefer-default-export": 0,
      "import/extensions": 0,
      "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
      "react/react-in-jsx-scope": 0,
      "@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/no-unused-vars": "warn",
      "react/function-component-definition": [1, {
        "namedComponents": "function-declaration",
        "unnamedComponents": "arrow-function"
      }]
    },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    },
    "react": { "version": "detect" },
  },
};
