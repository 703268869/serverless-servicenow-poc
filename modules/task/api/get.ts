import type { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendErrorResponse, sendResponse } from '../../../shared-packages/utils/response-handler';
import Log from '@dazn/lambda-powertools-logger';


import middleware from '../../../shared-packages/utils/middleware';
import { immerseReport, immerseReportByReportDateFilter } from '../utils/dynamodb-query';


const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('event 1 ============>', event);
    console.log('event ============>', JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    return sendResponse({
      response: { body: {
        "id": 5519,
        "skillid": "003782c0-6340-4221-85c4-4eae211ff32f",
        "companyid": "47464071-ad49-400f-a615-ebe2d2cecebc",
        "groupid": [
            "95e686e7-5651-4c92-8832-6dda6aec35d5"
        ],
        "skillname": "Transformation Lead",
        "aka": "transformation_lead",
        "description": "Transformation Lead",
        "tags": [
            "none"
        ],
        "genomeid": 1,
        "externalid": 1,
        "skillstatus": "1",
        "created_at": "2021-04-07T06:33:14.542Z",
        "updated_at": "2021-04-07T06:33:14.542Z",
        "entityversion": 1,
        "hrmsid": null
    }},
    });
  } catch (error) {
    Log.error(error.message, new Error(error));
    return sendErrorResponse({ response: error.message });
  }
};

export const fn = middleware(handler);
