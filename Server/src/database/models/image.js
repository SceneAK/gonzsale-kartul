export default function defineModel(sequelize, DataTypes)
{
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        path: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    Image.associate = function(models) {
        Image.hasOne(models.Store, {
            as: 'storeWithImage',
            foreignKey: 'imageId',
            onDelete: 'RESTRICT'
        });
        Image.hasOne(models.Store, {
            as: 'storeWithQrImage',
            foreignKey: 'qrImageId',
            onDelete: 'SET NULL'
        });
        Image.hasOne(models.ProofTransaction, {
            foreignKey: 'proofImageId',
            onDelete: 'RESTRICT'
        });
        Image.hasMany(models.ProductImage, {
            foreignKey: 'imageId',
            onDelete: 'RESTRICT'
        });
    }

    return Image;
}