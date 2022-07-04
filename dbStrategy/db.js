import { MongoClient } from 'mongodb';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);
    console.log(chalk.blueBright("Database connected!"));
} catch(error) {
    console.log(error);
    console.log(chalk.red("Database connection failed!"));
}

export default db;