/** @type {import('jest').Config} */
const config = {
    clearMocks: true,

    collectCoverageFrom: ['src/**/*.js'],

    collectCoverage: true,

    coverageDirectory: 'coverage',

    coverageProvider: 'v8',

    transform: {
        '^.+\\.js$': 'babel-jest',
    },

    transformIgnorePatterns: ['node_modules/(?!(@faker-js)/)'],
}

export default config
