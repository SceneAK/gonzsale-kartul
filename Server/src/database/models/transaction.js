export default function defineModel(sequelize, DataTypes) {
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
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM('PROOF-BASED', 'CASH-ON-DELIVERY'),
            allowNull: false,
            defaultValue: "PROOF-BASED"
        },
        type: {
            type: DataTypes.ENUM('PAYMENT', 'REFUND'),
            allowNull: false
        }
    });
    Transaction.associate = function(models) {
        Transaction.belongsTo(models.Order, {
            foreignKey: 'orderId'
        });
        Transaction.hasOne(models.ProofTransaction, {
            foreignKey: 'transactionId'
        });
    }
    return Transaction;
}