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
        username: {
            type:DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ENUM("ADMIN", "USER", "OWNER"),
            allowNull: false,
            defaultValue: "USER",
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
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
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
        delete attributes.deletedAt;
        return attributes;
    };

    // Define the association between Venue and User models
    User.associate = (models) => {
        User.hasMany(models.Venue, { foreignKey: 'ownerId', as: 'venues', onDelete: 'CASCADE' });
    };
    

    return User;
}

export default User;
