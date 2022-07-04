import express, { json } from "express";
import chalk from "chalk";
import cors from "cors";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";


import db from "./dbStrategy/db.js"
import { userSchema }  from "./schemas/userSchema.js"

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

app.post("/signin", async (request, response) => {

  const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });
  const { error } = signInSchema.validate(request.body, {abortEarly: false});
    if(error){
        return response.sendStatus(422)
    }

  try {
    const user = await db.collection("users").findOne({email: request.body.email})
    if(!user) return response.sendStatus(404);
    if(user && bcrypt.compareSync(request.body.password, user.password)){
      const token = uuid();
      await db.collection("sessions").insertOne({token, userId: user._id})
      response.send({token, name: user.name});
    } else {
      return response.sendStatus(401)
    }
  } catch {
    return response.sendStatus(500);
  }
});


const port = process.env.PORT || 5000;

app.listen (port, () => {
    console.log(chalk.greenBright(`Server running on port: ${port}`));
});
