import joi from "joi";
import { v4 as uuid } from "uuid";

import db from "./../dbStrategy/db.js";
import { userSchema }  from "./../schemas/userSchema.js";
import { signInSchema }  from "./../schemas/signInSchema";

export async function signUp(req,res) {
    const {error} = userSchema.validate(req.body, {abortEarly: false});

    try {
       const SALT = 10;
       const passwordHash = bcrypt.hashSync(req.body.password, SALT);
       
       await db.collection("users").insertOne({
         name: req.body.name,
         email: req.body.email,
         password: passwordHash
       });
   
       return res.sendStatus(201); 
     } catch (error) {
       console.log("Error creating new user.");
       console.log(error);
       return res.sendStatus(500);
     }
}

export async function signIn(req,res) {
    const data = req.body;

    
    const { error } = signInSchema.validate(data, {abortEarly: false});
    
    if(error){
        return response.sendStatus(422);
    }

    try {
        const user = await db.collection("users").findOne({email: data.email});
    
        if(!user) return response.sendStatus(404);

        if(user && bcrypt.compareSync(data.password, user.password)){
            const token = uuid();
            await db.collection("sessions").insertOne({token, userId: user._id})
            response.send({token, name: user.name});
        } else {
            return response.sendStatus(401);
         }
    } catch {
        return response.sendStatus(500);
    }
}

