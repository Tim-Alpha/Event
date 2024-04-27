import express from 'express';
import db from './models/index.js';

const app = express();
const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    db.sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database synchronized successfully');
        })
        .catch(error => {
            console.error('Error synchronizing database:', error);
        });
});
