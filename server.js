import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import db from './src/models/index.js';
import userRouter from './src/routers/user.js';
import venueRouter from './src/routers/venue.js';
import eventRouter from './src/routers/event.js';
import bookingRouter from './src/routers/booking.js';
import reviewRouter from './src/routers/review.js';
import searchRouter from './src/routers/search.js';

const app = express();
const port = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
const v1 = '/api/v1';

app.use(v1, userRouter);
app.use(v1, venueRouter);
app.use(v1, eventRouter);
app.use(v1, bookingRouter);
app.use(v1, reviewRouter);
app.use(v1, searchRouter);

// Error handling middleware should be placed after all other middleware/route usage.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.get('/v1/migrations/run/:password', (req, res) => {
    const password = req.params.password;
    if (password !== 'sachin1234') {
        res.status(400).json({message: "Sorry wrong password!"});
    }
    exec('sequelize db:migrate', (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({message: "Sorry error in executing migration!"});
        }
        res.status(200).json({message: "Migration run completed successfully"});
    })
});

// Async function to handle DB sync and server start
const startServer = async () => {
    try {
        await db.sequelize.sync({alter: true});
        // await db.sequelize.sync();
        console.log('Database synchronized successfully');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

startServer();
