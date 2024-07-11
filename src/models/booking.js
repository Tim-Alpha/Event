import { DataTypes } from "sequelize";

const Booking = (sequelize) => {
    const Booking = sequelize.define("Booking", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field: 'status'
        },
        bookingDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'booking_date'
        }
    }, {
        tableName: "bookings",
        underscored: true,
        paranoid: true,
        hooks: {
            afterCreate: async (booking, options) => {
                try {
                    const user = await booking.getUser();
                    const venue = await booking.getVenue();
                    booking.setDataValue('user', user);
                    booking.setDataValue('venue', venue);
                } catch (error) {
                    console.error('Error in fetching owner data: ' + error);
                }
            }
        }
    });

    Booking.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.deletedAt;
        delete attributes.userId;
        delete attributes.venueId;

        return attributes;
    }

    Booking.associate = (models) => {
        Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
        Booking.belongsTo(models.Event, { foreignKey: 'venueId', as: 'venue', onDelete: 'CASCADE' });
    };

    return Booking;
}

export default Booking;