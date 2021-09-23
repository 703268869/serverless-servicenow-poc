import S3 from 'aws-sdk/clients/s3';
import { PassThrough } from 'stream';

export default (
  stream,
  bucketName: string,
  fileName: string,
  s3Config = {},
): { passThrough: PassThrough; promise: Promise<S3.ManagedUpload.SendData> } => {
  const passThrough = new PassThrough();
  const s3 = new S3(s3Config);
  const config: {
    Bucket: string;
    Key: string;
    Body: PassThrough;
    ContentType?: string;
    ContentLength?: any;
  } = {
    Bucket: bucketName,
    Key: fileName,
    Body: passThrough,
  };

  if (stream.headers && stream.headers['content-type']) config.ContentType = stream.headers['content-type'];
  if (stream.headers && stream.headers['content-type']) config.ContentLength = stream.headers['content-length'];

  const promise = s3.upload(config).promise();
  return { passThrough, promise };
};
