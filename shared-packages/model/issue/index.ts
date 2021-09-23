import { Model, Optional } from 'sequelize';
  
interface IssueAttributes {
    id: number;
    transactionId: number;
    serviceNowParentTaskId: number;
    serviceNowTaskId: number;
    description: string;
    owner: string;
    status: string;
    supportNeeded: string;
    topic: string;
    isDirectCustomerImpact: boolean;
    isAlertToGOL: boolean;
    closingDate: string;
    expiryDate: string;
    createdBy: number;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;    
}

interface IssueCreationAttributes extends Optional<IssueAttributes, "id"> {

}
  
class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  
    public id: number;
    public transactionId: number;
    public serviceNowParentTaskId: number;
    public serviceNowTaskId: number;
    public description: string;
    public owner: string;
    public status: string;
    public supportNeeded: string;
    public topic: string;
    public isDirectCustomerImpact: boolean;
    public isAlertToGOL: boolean;
    public closingDate: string;
    public expiryDate: string;
    public createdBy: number;
    public readonly createdAt: string | null;
    public updatedBy: string;
    public readonly updatedAt: string; 
}

export {
    Issue
}