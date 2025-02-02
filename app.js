import { PORT } from "./configuration/envConfig.js";
import express from "express";
import usersRouter from "./router/usersRouter.js";


const app = express();
app.use(express.json());

app.use(`${process.env.API}/users`, usersRouter);

const port = PORT;
app.listen(port, () => {
  // Log a message indicating that the server is running and listening on the specified port
  console.log(`Listening on port ${port}`);
});
