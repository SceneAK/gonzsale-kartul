export default function defineModel(sequelize, DataTypes)
{
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
        },
        name: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('USER', 'STORE_MANAGER', 'ADMIN'),
            allowNull: false,
            defaultValue: 'USER'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ],
        paranoid: true
    });
    User.associate = function(models) {
        User.hasOne(models.UserStorage, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        User.hasOne(models.Store, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Order, {
            foreignKey: 'customerId'
        });
    }
    return User;
}