module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaVersion': 6
    },
    'env': {
        'browser': true
    },
    'rules': {
        'quotes': ['warn', 'single'],
        'indent': ['warn', 4, { SwitchCase: 1 }],
        'semi': 'off',
        'comma-dangle': ['warn', 'never'],
        'max-len': ['warn', 120],
        'function-paren-newline': 'off',

        'spaced-comment': 'warn',

        'no-useless-computed-key': 'warn',
        'no-useless-concat': 'warn',
        'no-useless-constructor': 'warn',
        'no-useless-escape': 'warn',

        'jsx-a11y/accessible-emoji': 'warn',
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/anchor-has-content': 'warn',
        'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
        'jsx-a11y/aria-props': 'warn',
        'jsx-a11y/aria-proptypes': 'warn',
        'jsx-a11y/aria-role': 'warn',
        'jsx-a11y/aria-unsupported-elements': 'warn',
        'jsx-a11y/heading-has-content': 'warn',
        'jsx-a11y/iframe-has-title': 'warn',
        'jsx-a11y/img-redundant-alt': 'warn',
        'jsx-a11y/no-access-key': 'warn',
        'jsx-a11y/no-distracting-elements': 'warn',
        'jsx-a11y/no-redundant-roles': 'warn',
        'jsx-a11y/role-has-required-aria-props': 'warn',
        'jsx-a11y/role-supports-aria-props': 'warn',
        'jsx-a11y/scope': 'warn',

        'react/prefer-es6-class': 'warn',
        'react/prefer-stateless-function': 'warn',
        'react/jsx-boolean-value': ['warn', 'never', { always: [] }],
        'react/jsx-indent-props': ['warn', 4],
        'react/jsx-indent':['warn', 4],
        'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
        'react/jsx-no-literals': ['off', { noStrings: true }],
        'react/jsx-no-undef': 'warn',
        'react/jsx-uses-react': ['warn'],
        'react/jsx-uses-vars': 'warn',
        'react/no-danger': 'warn',
        'react/no-deprecated': ['warn'],
        'react/no-did-mount-set-state': 'off',
        'react/no-did-update-set-state': 'warn',
        'react/no-will-update-set-state': 'warn',
        'react/no-direct-mutation-state': 'off',
        'react/no-is-mounted': 'warn',
        'react/prop-types': ['warn', { ignore: [], customValidators: [], skipUndeclared: false }],
        'react/require-default-props': 'warn',
        'react/no-unused-prop-types': 'warn',
        'react/no-unused-state': 'warn',
        'react/react-in-jsx-scope': 'warn',
        'react/require-render-return': 'warn',
        'react/self-closing-comp': 'warn',
        'react/no-find-dom-node': 'warn',
        'react/no-array-index-key': 'warn',
        'react/no-typos': 'off',
        'react/jsx-curly-spacing': 'warn',
        'react/forbid-prop-types': 'off',

        'object-curly-spacing': 'warn',
        'object-curly-newline': 'off',
        'curly': 'off',
        'arrow-body-style': 'warn',
        'arrow-parens':'warn',
        'import/no-mutable-exports':'warn',
        'import/no-named-as-default': 'off',
        'no-underscore-dangle': 'warn',
        'react/jsx-filename-extension': 'off',
        'quote-props': 'warn',

        'no-use-before-define': 'off',
        'no-shadow': 'warn',

        'no-multi-spaces': 'warn',
        'no-irregular-whitespace': 'warn',
        'react/jsx-tag-spacing': 'warn',
        'import/first': 'warn',
        'no-restricted-syntax':'warn',
        'vars-on-top': 'warn',
        'no-prototype-builtins': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'no-extra-semi': 'warn',
        'prefer-destructuring': 'warn',
        'jsx-a11y/label-has-for': 'warn',
        'prefer-template': 'warn',
        'no-else-return': 'warn',
        'padded-blocks': 'warn',
        'eol-last': 'warn',
        'no-param-reassign': 'warn',
        'consistent-return': 'warn',
        'jsx-quotes':'warn',
        'react/jsx-closing-tag-location': 'warn',
        'comma-spacing': 'warn',
        'class-methods-use-this': 'warn',
        'no-plusplus': 'warn',
        'array-callback-return': 'warn',
        'guard-for-in': 'warn',
        'jsx-a11y/anchor-is-valid': ['warn', {
            "components": [ "Link" ],
            "specialLink": [ "to", "hrefLeft", "hrefRight" ],
            "aspects": [ "noHref", "invalidHref", "preferButton" ]
        }],
        'import/prefer-default-export': 'warn',
        'react/sort-comp': 'warn',
        'no-nested-ternary': 'warn',
        'react/jsx-wrap-multilines': 'warn',

        'block-scoped-var': 'warn',
        'complexity': ['off', 11],
        'dot-notation': ['warn', { allowKeywords: true }],
        'radix': 'warn',
        'no-const-assign': 'warn',
        'prefer-const': ['warn', {
            destructuring: 'any',
            ignoreReadBeforeAssign: true,
          }],
        'no-var': 'warn'
    }
};
