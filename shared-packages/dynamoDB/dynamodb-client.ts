import { Converter } from 'aws-sdk/clients/dynamodb';
import Db from './dynamodb-corelation-module';
import AWS from 'aws-sdk';
// import  { queryParams } from './config';

export const DynamoDB = {
  /**
   * Returns An array of items that match the query criteria. Each element in this array consists of an attribute name and the value for that attribute
   *
   * @param {AWS.DynamoDB.QueryInput} params
   * @returns
   */
  async query(params: AWS.DynamoDB.QueryInput) {
    // const params = {
    //   TableName: tableName,
    //   ...condition,
    // };
    const res: AWS.DynamoDB.QueryOutput = await Db.query(params).promise();
    if (!res) return null;
    return res;
  },

  /**
   *Returns An array of items that match the scan criteria. Each element in this array consists of an attribute name and the value for that attribute
   *
   * @param {AWS.DynamoDB.ScanInput} params
   * @returns
   */
  async scan(params: AWS.DynamoDB.ScanInput) {
    // const params = {
    //   TableName: tableName,
    //   ...condition,
    // };
    const res: AWS.DynamoDB.ScanOutput = await Db.scan(params).promise();
    if (!res) return null;
    return res;
  },
  /**
   *A map of attribute name to attribute values, representing the primary key of an item to be processed by PutItem.
   *
   * @param {*} condition
   * @param {string} tableName
   * @returns
   */
  async putItem(params: AWS.DynamoDB.PutItemInputAttributeMap) {
    // const params = {
    //   TableName: tableName,
    //   ...condition,
    // };
    const result: AWS.DynamoDB.PutItemOutput = await Db.put(params).promise();
    if (!result) throw new Error(`Error in adding data in dynamodb table ${params.TableName}`);
    return result;
  },
  /**
   *
   *
   * @param {*} condition
   * @param {string} tableName
   * @returns
   */
  async updateItem(params: AWS.DynamoDB.UpdateItemInput) {
    // const params = {
    //   TableName: tableName,
    //   ...condition,
    // };
    const result: AWS.DynamoDB.UpdateItemOutput = await Db.update(params).promise();
    if (!result) throw new Error(`Error in updating record in dynamodb table ${params.TableName}`);
    return result;
  },
  /**
   *
   *
   * @param {*} params
   * @returns
   */
  async transactionWrite(params: AWS.DynamoDB.TransactWriteItemsInput) {
    const result: AWS.DynamoDB.TransactWriteItemsOutput = await Db.transactWrite(params).promise();
    if (!result) throw new Error('Error in adding transactional data in dynamodb table');
    return result;
  },
  /**
   *
   *
   * @param {*} params
   * @returns
   */
  async batchWrite(params: AWS.DynamoDB.BatchWriteItemInput) {
    const result: AWS.DynamoDB.BatchWriteItemOutput = await Db.batchWrite(params).promise();
    if (!result) throw new Error('Error in adding transactional data in dynamodb table');
    return result;
  },
  /**
   *
   *
   * @param {*} data
   * @returns
   */
  unmarshall(data: AWS.DynamoDB.AttributeMap) {
    return Converter.unmarshall(data);
  },
};
