import { DataTypes, getInstance } from "../sequelize.js";
import Store from './storeModel.js';
import Image from "./imageModel.js";
const sequelize = getInstance();

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
    price: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    availability: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE', 'PREORDER'),
        allowNull: false,
        defaultValue: 'UNAVAILABLE'
    }
});

Store.hasMany(Product, {foreignKey: 'storeId'})
Product.belongsTo(Store, {foreignKey: 'storeId'})

const ProductImage = sequelize.define('ProductImage', {
    imageId: {
        type: DataTypes.UUID,
        primaryKey: true
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

Product.hasMany(ProductImage, {foreignKey: 'productId'});
ProductImage.belongsTo(Product, {foreignKey: 'productId'});

Image.hasOne(ProductImage, {foreignKey: 'imageId'});
ProductImage.belongsTo(Image, {foreignKey: 'imageId'});

const Variant = sequelize.define('Variant', {
    id:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

Product.hasMany(Variant, {foreignKey: 'productId'})
Variant.belongsTo(Product, {foreignKey: 'productId'})

export { Product, ProductImage, Variant };