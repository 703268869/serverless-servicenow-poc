import type { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendErrorResponse, sendResponse } from '../../../shared-packages/utils/response-handler';
import Log from '@dazn/lambda-powertools-logger';


import middleware from '../../../shared-packages/utils/middleware';
import { immerseReport, immerseReportByReportDateFilter } from '../utils/dynamodb-query';


const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('event ============>', JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    return sendResponse({
      response: { body: [
        {
            "skillrating": "d135cb8c-57c5-4704-bc69-9df6a3f59eb6",
            "ratingname": "B"
        },
        {
            "skillrating": "8162148c-08e7-48bd-9330-2038e6eb7c67",
            "ratingname": "I"
        },
        {
            "skillrating": "2748db7d-2632-483a-9d44-bbd423bfa413",
            "ratingname": "P"
        },
        {
            "skillrating": "13009ffc-3b03-4b19-8699-4c3c40f0e356",
            "ratingname": "E"
        }
    ]},
    });
  } catch (error) {
    Log.error(error.message, new Error(error));
    return sendErrorResponse({ response: error.message });
  }
};

export const fn = middleware(handler);
