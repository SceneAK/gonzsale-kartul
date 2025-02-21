export default function defineModel(sequelize, DataTypes)
{

    const OrderItem = sequelize.define('OrderItem', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        orderId:{
            type: DataTypes.UUID,
            allowNull: false
        },
        variantId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        productName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        productDescription: {
            type: DataTypes.TEXT
        },
        variantName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        variantPrice: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        variantUnit: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'READY', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING'
        }
    }, {paranoid: true});

    OrderItem.associate = function(models) {
        OrderItem.belongsTo(models.Order, {
            foreignKey: 'orderId'
        });
        OrderItem.belongsTo(models.Variant, {
            foreignKey: 'variantId'
        });
    }

    return OrderItem;
}