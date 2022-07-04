import express, { json } from 'express';
import chalk from 'chalk';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import db from "./dbStrategy/db.js"
import userSchema from "./schemas/userSchema.js"

dotenv.config();
const app = express();

app.use(json(), cors());



// signup e signin
app.post('/sign-up', async (req,res) => {
      
     const {error} = userSchema.validate(req.body, {abortEarly: false});

     try {
        const SALT = 10;
        const passwordHash = bcrypt.hashSync(req.body.password, SALT);
        
        await db.collection("users").insertOne({
          name: req.body.name,
          email: req.body.email,
          password: passwordHash
        });
    
        return res.sendStatus(201); // created
      } catch (error) {
        console.log("Error creating new user.");
        console.log(error);
        return res.sendStatus(500);
      }
})


const port = process.env.PORT || 5000;

app.listen (port, () => {
    console.log(chalk.greenBright(`Server running on port: ${port}`));
});
