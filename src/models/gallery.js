import { DataTypes } from "sequelize";

const Gallery = (sequelize) => {
    const Gallery = sequelize.define("Gallery", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
        gallery_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        url_type: {
            type: DataTypes.STRING(10),
            allowNull: true
        }
    }, {
        tableName: "gallery",
        underscored: true,
        paranoid: true
    })
    
    Gallery.prototype.toJSON = function () {
        let attributes = Object.assign({}, this.get());
        delete attributes.id;
        delete attributes.deletedAt;
        delete attributes.venueId;

        return attributes;
    }

    Gallery.associate = (models) => {
        Gallery.belongsTo(models.Venue, {foreignKey: 'venueId', as: 'venue', onDelete: 'CASCADE'});
    }

    return Gallery;
}

export default Gallery;