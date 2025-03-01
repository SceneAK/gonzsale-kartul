export default function defineModel(sequelize, DataTypes)
{
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
            type: DataTypes.UUID
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
    Store.associate = function(models) {
        Store.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Store.belongsTo(models.Image, {
            as: 'image',
            foreignKey: 'imageId'
        });
        Store.belongsTo(models.Image, {
            as: 'qrImage',
            foreignKey: 'qrImageId'
        });
        Store.hasMany(models.Product, {
            foreignKey: 'storeId',
            onDelete: 'CASCADE'
        });
        Store.hasMany(models.Order, {
            foreignKey: 'storeId',
            onDelete: 'CASCADE'
        });
    }

    return Store;
}