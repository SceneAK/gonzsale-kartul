import { sequelize, DataTypes } from "../sequelize.js";

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    path: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    scopes: {
        withoutId:{
            attributes: { exclude: ['id'] }
        }
    }
});
export default Image;