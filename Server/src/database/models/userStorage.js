export default function defineModel(sequelize, DataTypes)
{
    const UserStorage = sequelize.define('UserStorage', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        usedStorage: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    })
    UserStorage.associate = function(models) {
        UserStorage.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        })
    }
    return UserStorage;
}