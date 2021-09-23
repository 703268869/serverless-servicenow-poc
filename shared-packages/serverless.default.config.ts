import type { AWS } from '@serverless/typescript';
import { name } from '../package.json';

export const { NODE_ENV } = process.env;

if (!NODE_ENV) {
  throw new Error('NODE_ENV environment variable is required');
}

export const service = name;
export const region = 'ap-south-1';

const plugins = ['serverless-esbuild', 'serverless-prune-plugin'];
if (NODE_ENV === 'local') plugins.push('serverless-offline');

export const config: AWS = {
  service,
  frameworkVersion: '2',
  // disabledDeprecations: '*',

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region,
    memorySize: 128,
    versionFunctions: true,
    lambdaHashingVersion: '20201221',
    vpc: {
      subnetIds: ['${ssm:/core/vpc/subnets/private-a/ID}', '${ssm:/core/vpc/subnets/private-b/ID}'],
      securityGroupIds: ['${ssm:/core/vpc/security-group/sg-http-https-only/ID}'],
    },
    eventBridge: {
      useCloudFormation: true,
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    logs: {
      httpApi: false,
      restApi: {
        accessLogging: true,
        level: 'INFO',
        executionLogging: true,
        fullExecutionData: true,
      },
    },
    apiGateway: {
      metrics: true,
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      // binaryMediaTypes: ['*/*'],
    },
    environment: {
      NODE_ENV,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    deploymentBucket: {
      name: `tas-deployments-bucket-${NODE_ENV}-` + '${self:provider.region}',
      maxPreviousDeploymentArtifacts: 10,
      blockPublicAccess: true,
      serverSideEncryption: 'AES256',
    },
  },

  package: {
    individually: true,
    excludeDevDependencies: true,
    patterns: ['node_modules/aws-sdk/**'],
  },

  custom: {
    serviceUrlBasePath: service,
    esbuild: {
      bundle: true,
      minify: true,
    },
    splitStacks: {
      nestedStackCount: 20,
      perFunction: true,
      perType: false,
      perGroupFunction: false,
    },
    prune: {
      automatic: true,
      includeLayers: true,
      number: 5,
    },
  },

  plugins,
};
