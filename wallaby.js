module.exports = function(wallaby) {
    return {
        files: ['lib/**/*.ts', { pattern: 'lib/**/__tests__/**/*.ts', ignore: true }],
        tests: ['lib/**/__tests__/**/*.ts'],

        compilers: {
            '**/*.ts': wallaby.compilers.typeScript()
        },

        env: {
            type: 'node',
            runner: 'node',
            params: {
                env: `BASE_PATH=${__dirname}`
            }
        },

        testFramework: 'jest',

        setup: function(wallaby) {
            const jestConfig = require('./package.json').jest;
            wallaby.testFramework.configure(jestConfig);
        }
    };
};
