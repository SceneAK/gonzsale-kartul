import { DataTypes, getInstance } from "../sequelize.js";
const sequelize = getInstance();

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
});

export default Image;