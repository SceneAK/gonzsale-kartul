import { DataTypes, getInstance } from "../sequelize.js";
import { User } from "./userModel.js";
import Image from "./imageModel.js";
const sequelize = getInstance();

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    imageId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(35),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    qrImageId: {
        type: DataTypes.UUID
    },
    bankAccount: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    bankName: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {paranoid: true});
User.hasOne(Store, {foreignKey: 'userId'});
Store.belongsTo(User, {foreignKey: 'userId'});

Image.hasOne(Store, {as: 'storeWithImage', foreignKey: 'imageId', onDelete: 'RESTRICT'});
Store.belongsTo(Image, {as: 'image', foreignKey: 'imageId', onDelete: 'RESTRICT'});

Image.hasOne(Store, {as: 'storeWithQrImage', foreignKey: 'qrImageId', onDelete: 'SET NULL'});
Store.belongsTo(Image, {as: 'qrImage', foreignKey: 'qrImageId', onDelete: 'SET NULL'});

const StorePaymentMethod = sequelize.define('StorePaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    storeId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    
})

export default Store;