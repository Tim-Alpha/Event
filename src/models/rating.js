// id, userId, venuId, description, rating, createdAt, deletedAt
import { DataTypes } from "sequelize";

const Review = ( sequelize ) => {
    const Review = sequelize.define("Review", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        description: {
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
    });

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