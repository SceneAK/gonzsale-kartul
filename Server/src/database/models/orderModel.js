import { DataTypes, getInstance } from "../sequelize.js";
import { Product, Variant } from "./productModel.js";
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
        type: DataTypes.UUID,
        allowNull: false
    },
    storeId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    placedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
})
Order.belongsTo(Store, {foreignKey: 'storeId'})
Store.hasMany(Order, {foreignKey: 'storeId'})

Order.belongsTo(User, {foreignKey: 'customerId'})
User.hasMany(Order, {foreignKey: 'customerId'})

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
    quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
});

OrderItem.belongsTo(Order, {foreignKey: 'orderId'})
Order.hasMany(OrderItem, {foreignKey: 'orderId'})

OrderItem.belongsTo(Product, {foreignKey: 'productId'})
Product.hasMany(OrderItem, {foreignKey: 'productId'})

const OrderItemVariant = sequelize.define('OrderItemVariant', {
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    orderItemId:{
        type: DataTypes.UUID,
        allowNull: false
    },
    variantId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

OrderItemVariant.belongsTo(OrderItem, {foreignKey: 'orderItemId'})
OrderItem.hasMany(OrderItemVariant, {foreignKey: 'orderItemId'})

OrderItemVariant.belongsTo(Variant, {foreignKey: 'variantId'});
Variant.hasMany(OrderItemVariant, {foreignKey: 'variantId'});

export {Order, OrderItem, OrderItemVariant};