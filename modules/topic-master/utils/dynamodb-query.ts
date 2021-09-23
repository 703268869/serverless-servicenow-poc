import { DynamoDB } from '../../../shared-packages/dynamoDB/dynamodb-client';
import ssmStore from '../../../shared-packages/utils/ssm';
import { name } from '../../../package.json';
const service = name;
const { NODE_ENV } = process.env;
import { indexes } from './constant';

const tableName = async () => {
  const ssmParams = await ssmStore(`/genome/athena-api-svc/dynamo/ROOT-ATHENA-OUTPUT-TABLE/NAME`);
  return ssmParams.Parameter.Value;
};

export const immerseReport = async (fromDate, toDate, exclusiveStartKey = null, items = []) => {
  try {
    const eventTable = await tableName();

    let params: any = {
      TableName: eventTable,
      ExclusiveStartKey: exclusiveStartKey,
      ScanIndexForward: false,
    };

    if (fromDate && toDate) {
      params = {
        TableName: eventTable,
        ExclusiveStartKey: exclusiveStartKey,
        FilterExpression: 'fromDate = :fromDate and toDate = :toDate',
        ExpressionAttributeValues: {
          ':fromDate': `${fromDate}`,
          ':toDate': `${toDate}`,
        },
      };
    }
    // console.log('params ======>', JSON.stringify(params, null, 2));
    const res = await DynamoDB.scan(params);
    // console.log('res ----->', res);
    items.push(...res.Items);
    if (res.LastEvaluatedKey && res.LastEvaluatedKey.employeenumber) {
      await immerseReport(res.LastEvaluatedKey, items);
    }
    return items;
  } catch (error) {
    throw new Error(error);
  }
};

export const immerseReportByReportDateFilter = async (
  report: string,
  fromDate: string,
  toDate: string,
  exclusiveStartKey = null,
  items = [],
) => {
  try {
    let filterExpression : any = {
      KeyConditionExpression: '#report = :report',
      IndexName: indexes.REPORT_TIMESTAMP,
      ExpressionAttributeNames: {
        '#report': 'report',
      },
      ExpressionAttributeValues: {
        ':report': report,
      },
      ScanIndexForward: false,
      ExclusiveStartKey: exclusiveStartKey,
    };

    if (fromDate && toDate) {
      filterExpression = {
        KeyConditionExpression: '#report = :report',
        IndexName: indexes.REPORT_TIMESTAMP,
        FilterExpression: '#fromDate = :fromDate and #toDate = :toDate',
        ExpressionAttributeNames: {
          '#report': 'report',
          '#fromDate': 'fromDate',
          '#toDate': 'toDate',
        },
        ExpressionAttributeValues: {
          ':report': `${report}`,
          ':fromDate': `${fromDate}`,
          ':toDate': `${toDate}`,
        },
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey,
      };
    }
    const eventTable = await tableName();
    const params = {
      ...filterExpression,
      TableName: eventTable
    }
    // console.log('params ======>', params);
    const res = await DynamoDB.query(params);
    // // // console.log('checkNameWithVersion res --->', res);
    items.push(...res.Items);
    if (res.LastEvaluatedKey && res.LastEvaluatedKey.entity) {
      await immerseReportByReportDateFilter(report, fromDate, toDate, res.LastEvaluatedKey, items);
    }
    // // // console.log('checkNameWithVersion items ---> ', items);
    return items;
  } catch (error) {
    // // // console.log('checkNameWithVersion error -> ', error);
    throw new Error(error);
  }
};

export const updateAthenaOutputinDB = async (id: string, timestamp, data) => {
  try {
    //   const ssmParams = await ssmStore(`/core/sqs/${service}-oracle-oic-sftp-${NODE_ENV}-user/URL`);
    //   const TABLE_NAME = ssmParams.Parameter.Value;
    let objectQuery = 'SET ';
    const athenaAttributeValuesObject = {};
    const athenaExpressionAttributeNamesObject = {};
    const keys: any = Object.keys(data);
    // delete keys.employeenumber;
    // delete keys.timestamp;
    keys.lastupdated = new Date().toISOString();
    for (const key of keys) {
      const keyValue = key.toLowerCase();
      // if (keyValue.includes('employeenumber') || keyValue.includes('timestamp')) continue;
      // if (!keyValue.includes('customattribute')) {
      objectQuery = `${objectQuery} #${keyValue}= :${keyValue},`;
      athenaExpressionAttributeNamesObject[`#${keyValue}`] = keyValue;
      if (Number(data[`${key}`])) {
        athenaAttributeValuesObject[`:${keyValue}`] = Number(data[`${key}`]);
        continue;
      }
      athenaAttributeValuesObject[`:${keyValue}`] = data[`${key}`];
      // }
    }
    objectQuery = objectQuery.replace(/,\s*$/, '');
    const eventTable = await tableName();
    const filterExpression = {
      Key: {
        id: id,
        timestamp: timestamp,
      },
      UpdateExpression: `${objectQuery}`,
      ExpressionAttributeNames: athenaExpressionAttributeNamesObject,
      ExpressionAttributeValues: athenaAttributeValuesObject,
      ReturnValues: 'UPDATED_NEW',
    };

    const params: any = {
      ...filterExpression,
      TableName: eventTable
    }
    const res = await DynamoDB.updateItem(params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const putAthenaOutputRecord = async (data) => {
  try {
    const eventTable = await tableName();
       const params: any = {
      TableName: eventTable,
      Item: data,
    };
    const res = await DynamoDB.putItem(params);
    return res;
  } catch (error) {
    throw new Error(error);
  }
};