const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

type CracoConfig = any; // ou: import type { CracoConfig } from '@craco/craco';

const config: CracoConfig = {
  webpack: {
    configure: (config: any) => {
      config.resolve.plugins = config.resolve.plugins || [];
      config.resolve.plugins.push(new TsconfigPathsPlugin());
      return config;
    },
  },
  jest: {
    configure: (jestConfig: any) => {
      jestConfig.moduleNameMapper = {
        ...(jestConfig.moduleNameMapper || {}),
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^pages/(.*)$': '<rootDir>/src/components/pages/$1',
      };
      return jestConfig;
    },
  },
};

export default config;
