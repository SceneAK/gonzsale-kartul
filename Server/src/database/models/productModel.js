import { DataTypes, getInstance, Sequelize } from "../sequelize.js";
import Store from './storeModel.js';
import Image from "./imageModel.js";
const sequelize = getInstance();

const productAttributes = {
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
};
const Product = sequelize.define('Product', productAttributes, {
    scopes:{
        Available: {
            where: {
                isAvailable: true
            }
        }
    },
    paranoid: true
});

Store.hasMany(Product, {foreignKey: 'storeId'})
Product.belongsTo(Store, {foreignKey: 'storeId'})

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

Product.hasMany(ProductImage, { foreignKey: 'productId'});
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

Image.hasOne(ProductImage, {foreignKey: 'imageId'});
ProductImage.belongsTo(Image, {foreignKey: 'imageId'});

const variantAttributes = {
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
        allowNull: false
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
}
const Variant = sequelize.define('Variant', variantAttributes , {
    paranoid: true,
    indexes: [
        {
            name: 'composite',
            unique: true,
            fields: ['product_id', 'name']
        }
    ]
});

Variant.belongsTo(Product, {foreignKey: 'productId'});
Product.hasMany(Variant, {foreignKey: 'productId'})

export { Product, ProductImage, Variant, productAttributes, variantAttributes };