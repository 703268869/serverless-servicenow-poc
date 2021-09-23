const { NODE_ENV } = process.env;

export const addDefaultGateway = ({ rootServiceName, serverlessConfiguration }) => {
  if (!rootServiceName) {
    throw new Error('`rootServiceName` variable is required');
  }

  if (NODE_ENV === 'local') return serverlessConfiguration;

  if (!serverlessConfiguration.provider.apiGateway) {
    serverlessConfiguration.provider.apiGateway = {
      metrics: true,
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    };
  }

  // serverlessConfiguration.provider.apiGateway.restApiId =
  //   '${ssm:/' + rootServiceName + '/api-gateway/internal/root/REST-API-ID}';
  // serverlessConfiguration.provider.apiGateway.restApiRootResourceId =
  //   '${ssm:/' + rootServiceName + '/api-gateway/internal/root/ROOT-RESOURCE-ID}';

  if (serverlessConfiguration.custom.serviceUrlBasePath) {
    if (serverlessConfiguration.custom.serviceUrlBasePath.endsWith('-api-svc')) {
      serverlessConfiguration.custom.serviceUrlBasePath = serverlessConfiguration.custom.serviceUrlBasePath
        .split('-api-svc')
        .shift();
    }
    if (serverlessConfiguration.custom.serviceUrlBasePath.startsWith(`${rootServiceName}-`)) {
      serverlessConfiguration.custom.serviceUrlBasePath = serverlessConfiguration.custom.serviceUrlBasePath
        .split(`${rootServiceName}-`)
        .pop();
    }
  }

  return serverlessConfiguration;
};

export const addCorsConfig = (serverlessConfiguration) => {
  if (NODE_ENV === 'local') return serverlessConfiguration;

  if (serverlessConfiguration.functions) {
    const { functions } = serverlessConfiguration;
    Object.keys(functions).forEach((x) => {
      const eventsArr = functions[x].events;
      const eventsArrContainingHttpEvents = eventsArr.filter((y) => y['http']);
      if (eventsArr && eventsArrContainingHttpEvents.length) {
        const httpObjArr = eventsArr.filter((z) => z['http']);
        httpObjArr.forEach((obj) => {
          if (!obj['http']['cors']) {
            obj['http']['cors'] = {
              origin: '*',
              headers: [
                'Content-Type',
                'X-Amz-Date',
                'Authorization',
                'X-Api-Key',
                'X-Amz-Security-Token',
                'X-Amz-User-Agent',
                'x-oauth-config-provider',
              ],
              allowCredentials: false,
            };
          }
        });
      }
    });
  }
  return serverlessConfiguration;
};

// export const addDefaultAuthConfig = (serverlessConfiguration) => {
//   if (NODE_ENV === 'local') return serverlessConfiguration;

//   if (serverlessConfiguration.functions) {
//     const { functions } = serverlessConfiguration;
//     Object.keys(functions).forEach((x) => {
//       const eventsArr = functions[x].events;
//       const eventsArrContainingHttpEvents = eventsArr.filter((y) => y['http']);
//       if (eventsArr && eventsArrContainingHttpEvents.length) {
//         const httpObjArr = eventsArr.filter((z) => z['http']);
//         httpObjArr.forEach((obj) => {
//           if (!obj['http']['authorizer']) {
//             obj['http']['authorizer'] = {
//               name: `${service}-AUTHORIZER`,
//               arn: '${ssm:/core/api-gateway/external/root/CUSTOM-AUTHORIZER-LAMBDA-ARN}',
//               type: 'request',
//               resultTtlInSeconds: 300,
//               identitySource: 'method.request.header.Authorization',
//             };
//           }
//         });
//       }
//     });
//   }
//   return serverlessConfiguration;
// };
