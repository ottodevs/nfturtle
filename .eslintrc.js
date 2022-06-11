module.exports = {
    env: {
        browser: false,
        es2021: true,
        mocha: true,
        node: true,
    },
    plugins: ['@typescript-eslint', 'chai-friendly'],
    extends: ['standard', 'plugin:prettier/recommended', 'plugin:node/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: '.',
    },
    rules: {
        'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
        'node/no-missing-import': [
            'error',
            {
                allowModules: ['chai'],
                resolvePaths: ['test', 'src'],
                tryExtensions: ['.ts', '.json'],
            },
        ],
        'node/no-unpublished-import': ['error', { allowModules: ['ethers'] }],
    },
    overrides: [
        {
            files: '*.test.*',
            rules: {
                'no-unused-expressions': 'off',
                'chai-friendly/no-unused-expressions': 'error',
            },
        },
    ],
};
