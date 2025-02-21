
export default function defineModel(sequelize, DataTypes)
{
    const ProductImage = sequelize.define('ProductImage', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        imageId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        priority: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    });
    ProductImage.associate = function(models) {
        ProductImage.belongsTo(models.Image, {
            foreignKey: 'imageId'
        });
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'productId'
        });
    }
    return ProductImage;
}