import { DataTypes } from "sequelize";

const Review = ( sequelize ) => {
    const Review = sequelize.define("Review", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        rating: {
            type: DataTypes.ENUM("1", "2", "3", "4", "5"),
            allowNull: false,
        }
    }, {
        tableName: "review",
        underscored: true,
        paranoid: true,
        hooks: {
            afterCreate: async (rating, options) => {
                try {
                    const user = await rating.getUser();
                    const venue = await rating.getVenue();
                    rating.setDataValue('user', user);
                    rating.setDataValue('venue', venue);
                } catch (error) {
                    console.error('Error in fetching owner data: ' + error);
                }
            }
        }
    },);

    Review.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.deletedAt;
        return attributes;
    };
    
    // Define the association between other models and Review model
    Review.associate = (models) => {
        Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
        Review.belongsTo(models.Venue, { foreignKey: 'venueId', as: 'venue', onDelete: 'CASCADE' });
    };

    return Review
}

export default Review;