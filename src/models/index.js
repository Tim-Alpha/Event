'use strict';

import { readdirSync } from 'fs';
import { dirname, basename, join } from 'path';
import { fileURLToPath } from 'url';
import Sequelize, { DataTypes } from 'sequelize';
import { env as _env } from 'process';

// Derive __filename and __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseName = basename(__filename);
const env = _env.SERVER_ENV || 'development';
import config from '../../config/config.js';

const db = {};

let sequelize;
const environmentConfig = config[env];
if (environmentConfig.use_env_variable) {
    sequelize = new Sequelize(_env[environmentConfig.use_env_variable], environmentConfig);
} else {
    sequelize = new Sequelize(environmentConfig.database, environmentConfig.username, environmentConfig.password, environmentConfig);
}

const importModel = async (file) => {
    try {
        const { default: model } = await import(join(__dirname, file));
        db[model.name] = model(sequelize, DataTypes);
    } catch (error) {
        console.error(`Error importing model from file ${file}:`, error);
    }
};

const modelFiles = readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== baseName && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1);

for (let file of modelFiles) {
    await importModel(file);
}

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
