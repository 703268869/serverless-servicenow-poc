import type { AWS } from '@serverless/typescript';
import { config, service, NODE_ENV } from './shared-packages/serverless.default.config';
import { addDefaultGateway } from './shared-packages/serverless.utils';
import handlers from './serverless-dynamic-module-loader';

const tags = {
  Stack: (NODE_ENV || 'poc').toUpperCase(),
  Environment: (NODE_ENV || 'poc').toUpperCase(),
};

const prepareConfig = (serverlessConfiguration) => {
  if (NODE_ENV === 'local') return serverlessConfiguration;
  if (serverlessConfiguration.resources.Resources) {
    const resourcesObj = serverlessConfiguration.resources.Resources;
    Object.keys(resourcesObj).forEach((key) => {
      const resource = resourcesObj[key];
      if (resource.Properties) {
        if (
          resource.Type === 'AWS::DynamoDB::Table' ||
          resource.Type === 'AWS::SQS::Queue' ||
          resource.Type === 'AWS::S3::Bucket'
        ) {
          resource.Properties.Tags = Object.keys(tags).map((x) => ({ Key: x, Value: tags[x] }));
        } else resource.Properties.Tags = tags;
      }
    });
  }
  return serverlessConfiguration;
};

const serverlessConfiguration: AWS = {
  ...config,
  provider: {
    ...config.provider,
    tags,
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['ssm:GetParameter', 'ssm:GetParameterHistory', 'ssm:GetParameters', 'ssm:GetParametersByPath', 
            'secretsmanager:DescribeSecret', 'secretsmanager:ListSecretVersionIds', 'secretsmanager:ListSecrets',
            'secretsmanager:GetSecretValue', 'secretsmanager:GetResourcePolicy', 'lambda:*'],
            Resource: '*',
          },
        ],
      },
    },
  },

  resources: {
    Resources: {
      // DynamoDbSampleTable: {
      //   Type: 'AWS::DynamoDB::Table',
      //   DeletionPolicy: NODE_ENV === 'production' || NODE_ENV === 'uat' ? 'Retain' : 'Delete',
      //   Properties: {
      //     TableName: 'sample-dynamodb-TABLE',
      //     AttributeDefinitions: [
      //       {
      //         AttributeName: 'id',
      //         AttributeType: 'S',
      //       },
      //       {
      //         AttributeName: 'created',
      //         AttributeType: 'S',
      //       },
      //     ],
      //     KeySchema: [
      //       {
      //         AttributeName: 'id',
      //         KeyType: 'HASH',
      //       },
      //       {
      //         AttributeName: 'created',
      //         KeyType: 'RANGE',
      //       },
      //     ],
      //     GlobalSecondaryIndexes: [
      //       // {
      //       //   IndexName: 'id-created-index',
      //       //   KeySchema: [
      //       //     {
      //       //       AttributeName: 'id',
      //       //       KeyType: 'HASH',
      //       //     },
      //       //     {
      //       //       AttributeName: 'created',
      //       //       KeyType: 'RANGE',
      //       //     },
      //       //   ],
      //       //   Projection: {
      //       //     ProjectionType: 'ALL',
      //       //   },
      //       // },
      //       // {
      //       //   IndexName: 'report-created-index',
      //       //   KeySchema: [
      //       //     {
      //       //       AttributeName: 'report',
      //       //       KeyType: 'HASH',
      //       //     },
      //       //     {
      //       //       AttributeName: 'created',
      //       //       KeyType: 'RANGE',
      //       //     },
      //       //   ],
      //       //   Projection: {
      //       //     ProjectionType: 'ALL',
      //       //   },
      //       // },
      //     ],
      //     BillingMode: 'PAY_PER_REQUEST',
      //     // StreamSpecification: {
      //     //   StreamViewType: 'NEW_IMAGE',
      //     // },
      //   },
      // },

      // DynamoDbSampleTableParameterStore: {
      //   Type: 'AWS::SSM::Parameter',
      //   Properties: {
      //     Type: 'String',
      //     Name: `/servicenow-poc/${service}/dynamo/ROOT-SAMPLE-TABLE/NAME`,
      //     Description: `DynamoDB ARN for table ${`${service}-root-sample-${NODE_ENV}-TABLE`} in service ${service}-${NODE_ENV}`,
      //     Value: {
      //       Ref: 'DynamoDbSampleTable',
      //     },
      //   },
      // },

      // DynamoDbSampleTableArnParameterStore: {
      //   Type: 'AWS::SSM::Parameter',
      //   Properties: {
      //     Type: 'String',
      //     Name: `/servicenow-poc/${service}/dynamo/ROOT-sample-TABLE/ARN`,
      //     Description: `DynamoDB ARN for table ${`${service}-root-sample-${NODE_ENV}-TABLE`} in service ${service}-${NODE_ENV}`,
      //     Value: {
      //       'Fn::GetAtt': ['DynamoDbSampleTable', 'Arn'],
      //     },
      //   },
      // },
    },

    Outputs: {
      // DynamoDbSampleTableARN: {
      //   Value: {
      //     'Fn::GetAtt': ['DynamoDbSampleTable', 'Arn'],
      //   },
      //   Export: {
      //     Name: `${service}-DYNAMO-TABLE-REPORTS-ARN`,
      //   },
      // },
    },
  },
};

const conf = addDefaultGateway({ rootServiceName: 'servicenow-poc', serverlessConfiguration });
conf.functions = handlers(serverlessConfiguration);
module.exports = prepareConfig(conf);
