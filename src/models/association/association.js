const setupAssociations = (db) => {
    if (db.User && db.Venue) {
        db.User.hasMany(db.Venue, { 
            foreignKey: 'ownerId', 
            as: 'venues',
            onDelete: 'CASCADE'
        });
        db.Venue.belongsTo(db.User, { 
            foreignKey: 'ownerId', 
            as: 'owner',
            onDelete: 'CASCADE' 
        });
    } else {
        console.error('Models are not loaded properly into db object');
    }
};

export default setupAssociations;
