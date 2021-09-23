// import messageSchema from '../../models/message-schema.json';
import type { Functions } from 'serverless/aws';
// import { name } from '../../package.json';
// export const { NODE_ENV, npm_package_name } = process.env;
// const service = npm_package_name;
module.exports = ({ custom, resources, provider }): Functions => {
  return {
    'task-api-GET': {
      handler: 'modules/task/api/get.fn',
      events: [
        {
          http: {
            path: `${custom.serviceUrlBasePath}/get-task`,
            method: 'get',
            cors: {
              origins: '*',
              headers: [
                'Content-Type',
                'X-Amz-Date',
                'Authorization',
                'X-Api-Key',
                'X-Amz-Security-Token',
                'X-Amz-User-Agent',
                'Access-Control-Allow-Origin',
                'x-oauth-config-provider',
                'Access-Control-Allow-Headers',
              ],
              allowCredentials: false,
            },
          },
        },
      ],
    },
    'task-api-POST': {
      handler: 'modules/task/api/post.fn',
      events: [
        {
          http: {
            path: `${custom.serviceUrlBasePath}/post-task`,
            method: 'post',
            cors: {
              origins: '*',
              headers: [
                'Content-Type',
                'X-Amz-Date',
                'Authorization',
                'X-Api-Key',
                'X-Amz-Security-Token',
                'X-Amz-User-Agent',
                'Access-Control-Allow-Origin',
                'x-oauth-config-provider',
                'Access-Control-Allow-Headers',
              ],
              allowCredentials: false,
            },
          },
        },
      ],
    },
  };
};
