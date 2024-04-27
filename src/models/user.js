import { DataTypes } from 'sequelize';
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();

const User = (sequelize) => {
    const User = sequelize.define("User", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
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
            defaultValue: "USER",
        }
    }, {
        tableName: "users",
        underscored: true,
        paranoid: true,
        hooks: {
            beforeSave: async (user, options) => {
                if (user.changed('password')) {
                    const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
                    user.password = await bcrypt.hash(user.password, saltRounds);
                }
            },
        }
    });

    User.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.password;
        return attributes;
    };

    return User;
}

export default User;
