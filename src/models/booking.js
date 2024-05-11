import { DataTypes } from "sequelize";

const Booking = ( sequelize ) => {
    const Booking = sequelize.define("Booking", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        bookingDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: "bookings",
        underscored: true,
        paranoid: true
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { foreignKeys: 'userId', as: 'user', onDelete: 'CASCADE' });
        Booking.belongsTo(models.Event, { foreignKeys: 'eventId', as: 'event', onDelete: 'CASCADE' });
    };

    return Booking;
}

export default Booking;