import { Sequelize, QueryTypes, DataTypes } from 'sequelize';
import { TopicMaster } from '../model/index';
import { SecretsManager } from 'aws-sdk';

let DB = {}, sequelize:any, dbConfig = {
  username: "",
  password: "",
  host: "",
  port: 0,
  dialect: 'mysql', 
  // dialectOptions: { options: { encrypt: true } },
  pool: {
    max: 5,    
    min: 0,    
    acquire: 30000,    
    idle: 10000    
  },
  define: { timestamps: false, }, 
  logging: (sql,timing) => { console.log('RDS Seq Conn Log::', sql, timing)}
};

(async () => {
  console.log('IIF');
  const client = new SecretsManager({region: 'ap-south-1'});
  // client
  const data: any = await client.getSecretValue({SecretId:`/ops360/database/rds`}).promise();
  console.log(`data in: ${JSON.stringify(data)}`);
  const { SecretString, VersionId, Name } = data;
  console.log(`data: SecretString ${SecretString}, VersionId ${VersionId} Name ${Name}`);
  const  { username, password, engine, host, port, dbInstanceIdentifier } = JSON.parse(SecretString);   
  console.log(`data: username ${username}, password ${password} engine ${engine} host ${host} port ${port}`);
  if (engine && username && password && host && port && dbInstanceIdentifier) {
    sequelize = new Sequelize('FLM', username, password,{
      host: host,  
      port: parseInt(port,10),
      dialect: engine,  
      dialectOptions: {
        options: {
          // useUTC: false,
          encrypt: true,
        },
      },
      define: {
        timestamps: false,
      },
    });
    TopicMaster.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      topic: { 
        type: DataTypes.TEXT,
        allowNull: false
      },
      isWFH: { 
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdBy: { 
        type: DataTypes.TEXT,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedBy: { 
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "report",
      freezeTableName: true,
      sequelize,
    }
    );
    DB['TopicMaster'] = TopicMaster;    
    console.log(`external user assignment ${DB['TopicMaster']}`);
    console.log(`external user info ${DB['TopicMaster']}`);
    console.log(`report ${DB['TopicMaster']}`);

  }
})();

export {
  DB, Sequelize, QueryTypes, getRdsConnection, executeRdsQuery, sequelize
};