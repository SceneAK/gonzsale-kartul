import { DataTypes, getInstance } from "../sequelize.js";
import Image from "./imageModel.js";
import { Order } from "./orderModel.js";
const sequelize = getInstance();


const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "PROOF-BASED"
    }
});

Order.hasOne(Transaction, {foreignKey: 'orderId', onDelete: 'RESTRICT'})
Transaction.belongsTo(Order, {foreignKey: 'orderId', onDelete: 'RESTRICT'})

const ProofTransaction = sequelize.define('ProofTransaction', {
    transactionId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    proofImageId: {
        type: DataTypes.UUID,
        allowNull: false
    }
})

ProofTransaction.belongsTo(Transaction, {foreignKey: 'transactionId'})
Transaction.hasOne(ProofTransaction, {foreignKey:'transactionId'})

ProofTransaction.belongsTo(Image, {foreignKey: 'proofImageId'})
Image.hasOne(ProofTransaction, {foreignKey: 'proofImageId'})

export {Transaction, ProofTransaction};