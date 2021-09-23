// import messageSchema from '../../models/message-schema.json';
import type { Functions } from 'serverless/aws';
// import { name } from '../../package.json';
// export const { NODE_ENV, npm_package_name } = process.env;
// const service = npm_package_name;
module.exports = ({ custom, resources, provider }): Functions => {
  return {
    'remark-api-GET': {
      handler: 'modules/remark/api/get.fn',
      events: [
        {
          http: {
            path: `${custom.serviceUrlBasePath}/get-remark`,
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
    'remark-api-POST': {
      handler: 'modules/remark/api/post.fn',
      events: [
        {
          http: {
            path: `${custom.serviceUrlBasePath}/post-remark`,
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
