// Import the express framework for building the web server
// Import dotenv to load environment variables from a .env file
import { PORT } from "./configuration/envConfig.js";
import RefreshApiKey from './database/realTimeUpdate/refreshApiKey.js'
import express from "express";
import usersRouter from "./router/usersRouter.js";
import https from "https";
import fs from "fs";

RefreshApiKey.scheduleApiKeyRefresh();
// Create an instance of an express application
const app = express();
app.use(express.json());
// Load environment variables from the .env file into process.env
app.use(`${process.env.API}/users`, usersRouter);

// Set the port to the value of the PORT environment variable or default to 3000 if not specified
const port = PORT || 3000;
const httpsOption = {
  key: fs.readFileSync("./web/private-key.pem"),
  cert: fs.readFileSync("./web/certificate.pem"),
};

// Create HTTPS server using the options
const httpsServer = https.createServer(httpsOption, app);

// Start the server and listen on the specified port (using httpsServer)
httpsServer.listen(port, () => {
  // Log a message indicating that the server is running and listening on the specified port
  console.log(`Listening on port ${port}`);
});
