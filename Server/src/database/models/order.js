export default function defineModel(sequelize, DataTypes)
{
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        customerId: {
            type: DataTypes.UUID
        },
        customerName: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        customerEmail: {
            type: DataTypes.STRING(320),
            unique: false
        },
        customerPhone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        storeId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {paranoid: true})
    Order.associate = function(models) {
        Order.belongsTo(models.Store, {
            foreignKey: 'storeId'
        });
        Order.belongsTo(models.User, {
            foreignKey: 'customerId'
        });
        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            onDelete: 'CASCADE'
        });
        Order.hasMany(models.Transaction, {
            foreignKey: 'orderId'
        })
    }
    return Order;
}