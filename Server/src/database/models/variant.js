export default function defineModel(sequelize, DataTypes)
{
    const Variant = sequelize.define('Variant', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        unit: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        paranoid: true,
        indexes: [
            {
                name: 'composite',
                unique: true,
                fields: ['product_id', 'name']
            }
        ]
    });
    Variant.associate = function(models) {
        Variant.belongsTo(models.Product, {
            foreignKey: 'productId'
        });
        Variant.hasMany(models.OrderItem, {
            foreignKey: 'variantId'
        });
    }
    return Variant;
}