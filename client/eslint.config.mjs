import globals from 'globals';
// import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactHooks from 'eslint-plugin-react-hooks';
// import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

export default [
    {
        languageOptions: {
            globals: globals.browser,
            parser: tsParser,
            ecmaVersion: 2021,
            sourceType: 'module'
        },
        plugins: {
            react: pluginReact,
            '@typescript-eslint': tseslint,
            prettier: pluginPrettier,
            'react-hooks': pluginReactHooks,
            import: pluginImport
        },
        rules: {
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': ['error'],
            'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
            'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                { allowExpressions: true }
            ],
            'max-len': ['warn', { code: 100, ignoreComments: true, ignoreUrls: true }],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'import/prefer-default-export': 'off',
            'react/prop-types': 'off',
            'prettier/prettier': ['error', { endOfLine: 'auto' }]
        },
        settings: {
            react: {
                version: 'detect'
            },
            'import/resolver': {
                typescript: true
            }
        }
    }
];
