export default function defineModel(sequelize, DataTypes)
{
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        storeId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        category: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        scopes:{
            Available: {
                where: {
                    isAvailable: true
                }
            }
        },
        paranoid: true
    });

    Product.associate = function(models) {
        Product.hasMany(models.ProductImage, {
            foreignKey: 'productId',
            onDelete: 'CASCADE'
        });
        Product.hasMany(models.Variant, {
            foreignKey: 'productId',
            onDelete: 'CASCADE'
        });
        Product.belongsTo(models.Store, {
            foreignKey: 'storeId'
        });
    }

    return Product;
}