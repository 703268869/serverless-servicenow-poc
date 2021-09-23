import type { APIGatewayEventInterface } from '@/types/APIGatewayEventInterface';

interface ParamSetInterface {
  error?: any;
  message?: any;
  details?: any;
}

export interface ResponseObjectOptionsInterface {
  code?: any;
  headers?: APIGatewayEventInterface['headers'];
  details?: any;
  response: APIGatewayEventInterface['body'];
}

export const sendResponse = ({ code, response, headers }: ResponseObjectOptionsInterface) => {
  return {
    statusCode: code || 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
    body: JSON.stringify(response),
  };
};

export const sendErrorResponse = ({ code, response, details }: ResponseObjectOptionsInterface) => {
  let message = 'Server error';
  if (code === 401) message = 'Unauthorized';
  else if (code === 400) message = 'Bad request';

  const obj: ParamSetInterface = {
    error: message,
    message: response || 'Error occurred.',
  };
  if (details) obj.details = details;

  return {
    statusCode: code || 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(obj),
  };
};
