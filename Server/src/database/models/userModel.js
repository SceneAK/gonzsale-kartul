import { sequelize, DataTypes } from "../sequelize.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(30),
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
    scopes:{
        withoutPassword:{
            attributes: { exclude: ['password']},
        },
        contactsOnly:{
            attributes: { include: ['username', 'email', 'phone']},
        }
    }
});

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
},{
    scopes:{
        withoutId:{
            attributes: { exclude: ['userId']},
        }
    }
})

export {User, UserStorage};