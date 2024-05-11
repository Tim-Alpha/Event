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
        paranoid: true
    });

    Event.associate = (models) => {
        Event.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
        Event.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue', onDelete: 'CASCADE' });
        Event.hasMany(models.Booking, { foreignKey: 'eventId', as: 'bookings', onDelete: 'CASCADE' });
    };

    return Event;
}

export default Event;