import express, { json } from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";


dotenv.config();
const app = express();

app.use(json(), cors());

app.use(authRouter);



//Rotas das transactions

app.get("transactions", (req,res) => {
  res.sendStatus(200);
})




const port = process.env.PORT || 5000;

app.listen (port, () => {
    console.log(chalk.greenBright(`Server running on port: ${port}`));
});
