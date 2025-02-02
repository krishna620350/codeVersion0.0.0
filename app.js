// import { PORT, API } from "./configuration/envConfig.js";
import dotenv from "dotenv";
import express from "express";
import usersRouter from "./router/usersRouter.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use(`${process.env.API}/users`, usersRouter);

const port = process.env.PORT;
app.listen(port, () => {
  // Log a message indicating that the server is running and listening on the specified port
  console.log(`Listening on port ${port}`);
});
