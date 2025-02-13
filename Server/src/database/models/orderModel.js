import { DataTypes, getInstance } from "../sequelize.js";
import { productAttributes, Variant, variantAttributes } from "./productModel.js";
import Store from './storeModel.js';
import { User, userAttributes } from "./userModel.js";
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
    customerName: userAttributes.name,
    customerEmail: {...userAttributes.email, unique: false},
    customerPhone: userAttributes.phone,
    storeId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {paranoid: true})
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
    variantId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productName: productAttributes.name,
    productDescription: productAttributes.description,
    variantName: variantAttributes.name,
    variantPrice: variantAttributes.price,
    variantUnit: variantAttributes.unit,
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

OrderItem.belongsTo(Order, {foreignKey: 'orderId'} )
Order.hasMany(OrderItem, {foreignKey: 'orderId'} )

OrderItem.belongsTo(Variant, { foreignKey: 'variantId' })
Variant.hasMany(OrderItem, { foreignKey: 'variantId' })

export {Order, OrderItem};