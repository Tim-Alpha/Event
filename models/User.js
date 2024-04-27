import dotenv from "dotenv"
export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("ADMIN", "USER", "OWNER"),
            allowNull: false,
            default: "USER",
        }      
    },
    {
        tableName: "users",
        underscored: true,
        paranoid: true,
    })
    User.beforeSave(async (user, options) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, process.env.SALT_ROUND);
        }
    });


    return User
}