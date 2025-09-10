module.exports = {
    extends: require.resolve('@umijs/max/eslint'),
    rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        'react/no-unescaped-entities': 'off',
        'no-param-reassign': 'off',
    },
};
