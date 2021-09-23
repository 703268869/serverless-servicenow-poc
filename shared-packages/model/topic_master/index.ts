import { Model, Optional, } from 'sequelize';
  
interface TopicMasterAttributes {
    id: number;
    topic: string;
    isWFH?: boolean;
    isActive?: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

interface TopicMasterCreationAttributes extends Optional<TopicMasterAttributes, "id"> {

}
  
class TopicMaster extends Model<TopicMasterAttributes, TopicMasterCreationAttributes> implements TopicMasterAttributes {
  
    public id!: number;
    public topic: string;
    public isWFH: boolean | null;
    public isActive: boolean | null;
    public readonly createdAt: string | null;
    public createdBy: string | null;
    public readonly updatedAt: string;
    public updatedBy: string | null;
}

export {
    TopicMaster
}