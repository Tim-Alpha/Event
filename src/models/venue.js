import { DataTypes } from "sequelize";

const Venue = (sequelize) => {
    const Venue = sequelize.define("Venue", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        venueName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        tableName: "venues",
        underscored: true,
        paranoid: true,
        hooks: {
            afterCreate: async (venue, options) => {
                try {
                    const owner = await venue.getOwner();
                    venue.setDataValue('owner', owner);
                } catch (error) {
                    console.error('Error in fetching owner data: ' + error);
                }
            }
        }
    });

    Venue.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.deletedAt;
        delete attributes.ownerId;

        return attributes;
    }
    
    // Define the association between Venue and User models
    Venue.associate = (models) => {
        Venue.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner', onDelete: 'CASCADE' });
    };
    

    return Venue;
}

export default Venue;