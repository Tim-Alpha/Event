import { DataTypes } from "sequelize";

const Event = ( sequelize ) => {
    const Event = sequelize.define("Event", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        eventDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        tableName: "events",
        underscored: true,
        paranoid: true,
        hooks: {
            afterCreate: async (event, options) => {
                try {
                    const user = await event.getUser();
                    const venue = await event.getVenue();
                    event.setDataValue('user', user);
                    event.setDataValue('venue', venue);
                } catch (error) {
                    console.error('Error in fetching user & venue data: ' + error);
                }
            }
        }
    });

    Event.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.userId;
        delete attributes.venueId;
        delete attributes.deletedAt;

        return attributes;
    }

    Event.associate = (models) => {
        Event.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
        Event.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue', onDelete: 'CASCADE' });
    };

    return Event;
}

export default Event;