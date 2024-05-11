import { DataTypes } from 'sequelize';

const Token = (sequelize) => {
    const Token = sequelize.define("Token", {
        token: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isDisabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: "tokens",
        underscored: true,
        paranoid: true,
    });

    Token.associate = (models) => {
        Token.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    };

    return Token;
}

export default Token;
