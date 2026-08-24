/** @type {import('jest').Config} */
const config = {
    clearMocks: true,

    setupFiles: ['dotenv/config'],

    collectCoverageFrom: ['src/**/*.js'],

    collectCoverage: true,

    coverageDirectory: 'coverage',

    coverageProvider: 'v8',

    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],

    transformIgnorePatterns: ['node_modules/(?!(@faker-js)/)'],
}

export default config
