import { SecretsManager } from 'aws-sdk';

export const waitForConnection = async(DBTableName: any) => {
    if (!DBTableName) {
        console.log(`${DBTableName}`);
        const client = new SecretsManager({region: 'ap-south-1'});
        await client.getSecretValue({SecretId:`/ops360/database/rds`}).promise();
    }
}