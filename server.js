import express from 'express';
import db from './src/models/index.js';
import cors from 'cors';
import userRouter from './src/routers/user.js';
import venueRouter from './src/routers/venue.js';

const app = express();
const port = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());
const v1 = '/api/v1';

app.use(v1, userRouter);
app.use(v1, venueRouter);

// Error handling middleware should be placed after all other middleware/route usage.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Async function to handle DB sync and server start
const startServer = async () => {
    try {
        // await db.sequelize.sync({alter: true});
        await db.sequelize.sync();
        console.log('Database synchronized successfully');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

startServer();
