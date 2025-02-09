import { DataTypes, getInstance } from "../sequelize.js";
import { Product } from "./productModel.js";
import Store from './storeModel.js';
import { User } from "./userModel.js";
const sequelize = getInstance();

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
        type: DataTypes.STRING(30)
    },
    customerEmail: userAttributes.email,
    customerPhone: userAttributes.phone,
    storeId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})
Order.belongsTo(Store, {foreignKey: 'storeId'})
Store.hasMany(Order, {foreignKey: 'storeId'})

Order.belongsTo(User, {foreignKey: 'customerId'})
User.hasMany(Order, {foreignKey: 'customerId'})

const productAttributes = Product.getAttributes();

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
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productName: productAttributes.name,
    productDescription: productAttributes.description,
    productPrice: productAttributes.price,
    productUnit: productAttributes.unit,
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'READY', 'COMPLETED', 'CANCELED'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
});

OrderItem.belongsTo(Order, {foreignKey: 'orderId'} )
Order.hasMany(OrderItem, {foreignKey: 'orderId'} )

OrderItem.belongsTo(Product, {foreignKey: 'productId'})
Product.hasMany(OrderItem, {foreignKey: 'productId'})

export {Order, OrderItem};