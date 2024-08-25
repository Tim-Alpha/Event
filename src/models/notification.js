import { DataTypes } from "sequelize";

const Notification = ( sequelize ) => {
    const Notification = sequelize.define("Notification", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        has_seen: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        action_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    }, {
        tableName: "notification",
        underscored: true,
        paranoid: true,
        hooks: {
            afterCreate: async (notification, options) => {
                try {
                    const user = await rating.getUser();
                    const venue = await rating.getVenue();
                    notification.setDataValue('user', user);
                    notification.setDataValue('venue', venue);
                } catch (error) {
                    console.error('Error in fetching owner data: ' + error);
                }
            }
        }
    },);

    Notification.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.userId;
        delete attributes.deletedAt;
        return attributes;
    };
    
    // Define the association between other models and Notification model
    Notification.associate = (models) => {
        Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
    };

    return Notification
}

export default Notification;