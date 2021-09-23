import type { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendErrorResponse, sendResponse } from '../../../shared-packages/utils/response-handler';
import Log from '@dazn/lambda-powertools-logger';

import axios from 'axios';
import middleware from '../../../shared-packages/utils/middleware';
import { immerseReport, immerseReportByReportDateFilter } from '../utils/dynamodb-query';

const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    console.log('event 1 ============>', event);
    console.log('event ============>', JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    const today = new Date();
    let month: any = today.getMonth() < 12 ? today.getMonth() + 1 : 1;
    month = ('0' + month).slice(-2);
    let year = today.getFullYear();
    const day = today.getDate();

    console.log('month, day, year', month, year, day);

     const token = Buffer.from('850046713:Password', 'utf8').toString('base64');
    const res: any = await axios({
      method: 'get',
      url: `https://genpactllcdemo2.service-now.com/api/now/table/u_tasks?sysparm_query=u_assigned_to%3D850046712%5Esys_created_on%3Ejavascript%3Ags.dateGenerate('${year}-${month}-${day}'%2C'00%3A00%3A00')`,
      // url: 'https://gapi-dev.azure-api.net/pulse-dev-ops360/graphql',
      headers: {
        Authorization: `Basic ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }); 
    console.log('response ==========>', res.data.result);  
    return sendResponse({ code: 200, response: res.data.result });
  } catch (e) {
    console.error('Error in fetching user scopes:', e);
    return sendErrorResponse({ code: 500, response: e.message });
  }
};

export const fn = middleware(handler);
