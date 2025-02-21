export default function defineModel(sequelize, DataTypes)
{
    const ProofTransaction = sequelize.define('ProofTransaction', {
        transactionId: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        proofImageId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    })

    ProofTransaction.associate = function(models) {
        ProofTransaction.belongsTo(models.Transaction, { 
            foreignKey: 'transactionId'
        });
        ProofTransaction.belongsTo(models.Image, {
            foreignKey: 'proofImageId'
        });
    }
    return ProofTransaction;
}