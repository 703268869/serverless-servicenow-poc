import type { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendErrorResponse, sendResponse } from '../../../shared-packages/utils/response-handler';
import Log from '@dazn/lambda-powertools-logger';


import middleware from '../../../shared-packages/utils/middleware';
import { immerseReport, immerseReportByReportDateFilter } from '../utils/dynamodb-query';
import { DB } from '../../../shared-packages/mysqlDB/sequelize';
import { waitForConnection } from '../../../shared-packages/utils/utils';

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('event 1 ============>', event);
    console.log('event ============>', JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    await waitForConnection(DB['Issue']);
    const res = await DB['Issue'].findAll();
    return sendResponse({
      response: { body: res},
    });
  } catch (error) {
    Log.error(error.message, new Error(error));
    return sendErrorResponse({ response: error.message });
  }
};

export const fn = middleware(handler);
