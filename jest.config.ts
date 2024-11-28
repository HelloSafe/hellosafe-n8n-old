import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

export default {
    // Automatically clear mock calls and instances between tests
    clearMocks: true,
  
    // Transform TypeScript files using ts-jest
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
  
    // Look for .test.ts files across the repository
    testRegex: '\\.test\\.ts$',
  
    // Supported file extensions
    moduleFileExtensions: ['ts', 'js'],
  
    // Coverage reports (optional)
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['nodes/**/*.ts'],

  };