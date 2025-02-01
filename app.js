import express from "express";
import router from "./router/router.js";

const app = express();
app.use(router);
app.listen(5002, () => { 
    console.log("Server is running on port 5002");
});