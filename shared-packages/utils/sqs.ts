import { v4 as uuid } from 'uuid';
const MessageQueue = require('@dazn/lambda-powertools-sqs-client');

export const Queue = {
  /**
   * send message to queue for processing data.
   *
   * @param {object} data
   * @param {string} queueName
   * @param {boolean} isFifo
   * @returns
   */
  async push(data: object, queueName: string, isFifo: boolean) {
    try {
      const params: {
        MessageBody: string;
        QueueUrl: string;
        MessageGroupId?: string;
      } = {
        MessageBody: JSON.stringify(data),
        QueueUrl: queueName,
      };
      if (isFifo) params.MessageGroupId = uuid();
      const res = await MessageQueue.sendMessage(params).promise();
      if (!res) throw new Error(`Error pushing new message in queue -> ${data}`);
      return res.MessageId;
    } catch (error) {
      // // console.log('Queue push -> error', error);
      throw new Error(error);
    }
  },
  async pull(queueName) {
    try {
      const params = {
        QueueUrl: queueName,
        MaxNumberOfMessages: 10,
        VisibilityTimeOut: 30,
        WaitTimeSeconds: 0,
      };

      const res = await MessageQueue.receiveMessage(params).promise();
      if (!res) {
        // // console.log("nothing to process!");
        return null;
      }
      return res;
    } catch (error) {
      // // console.log("Queue pull -> error", error);
      throw new Error(error);
    }
  },
};
