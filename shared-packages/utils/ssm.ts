import SSM from 'aws-sdk/clients/ssm';

const ssm = new SSM();
/**
 *Get information about a parameter ( Parameter Value ) by using the parameter name.
 *
 * @param {string} name
 * @returns
 */
const ssmStore = async (name: string) => {
  return await ssm
    .getParameter({
      Name: name,
    })
    .promise();
};

export default ssmStore;
