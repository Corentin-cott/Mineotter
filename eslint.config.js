// eslint.config.js
const { FlatCompat } = require("@eslint/eslintrc")

const compat = new FlatCompat({ baseDirectory: process.cwd() })

module.exports = [
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "error"
        }
    }
]
