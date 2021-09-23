import type { APIGatewayEvent } from 'aws-lambda';

type Weaken<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? any : T[P];
};
export interface APIGatewayEventInterface extends Weaken<APIGatewayEvent, 'body'> {
  body: any;
}
