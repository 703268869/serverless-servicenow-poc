import middy from '@middy/core';
// import cors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
// import httpSecurityHeaders from '@middy/http-security-headers';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import correlationIds from '@dazn/lambda-powertools-middleware-correlation-ids';
import sampleLogging from '@dazn/lambda-powertools-middleware-sample-logging';
import logTimeout from '@dazn/lambda-powertools-middleware-log-timeout';

const middleware = (handler) =>
  middy(handler)
    .use(httpEventNormalizer())
    .use(httpJsonBodyParser())
    .use(httpMultipartBodyParser())
    .use(httpUrlEncodePathParser())
    .use(httpErrorHandler())
    .use(doNotWaitForEmptyEventLoop({ runOnError: true }))
    // .use(cors())
    // .use(httpSecurityHeaders())
    .use(correlationIds({ sampleDebugLogRate: 0.01 }))
    .use(sampleLogging({ sampleRate: 0.01 }))
    .use(logTimeout());

export default middleware;
