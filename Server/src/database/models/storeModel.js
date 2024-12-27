import { sequelize, DataTypes } from "../sequelize.js";
import { User } from "./userModel.js";
import Image from "./imageModel.js";

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
}, {
    scopes:{
        onlyName:{
            attributes: ['name']
        },
        withImage:{
            include: {
                model: Image.scope('withoutId'),
                as: 'image'
            }
        },
        withQrImage:{
            include: {
                model: Image.scope('withoutId'),
                as: 'qrImage'   
            }
        },
        withOwner:{
            include: {
                model: User.scope('contactsOnly'),
                as: 'owner'
            }
        }
    }
});
User.hasOne(Store);
Store.belongsTo(User);

Image.hasOne(Store, {as: 'storeWithimage', foreignKey: 'imageId'});
Store.belongsTo(Image, {as: 'image', foreignKey: 'imageId'});

Image.hasOne(Store, {as: 'storeWithQrimage', foreignKey: 'qrImageId'});
Store.belongsTo(Image, {as: 'qrImage', foreignKey: 'qrImageId'});

export default Store;