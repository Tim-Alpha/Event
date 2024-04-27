import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const development = {
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'event',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
        bigNumberStrings: true,
    },
};



const config = {
    development
};

export default config;
