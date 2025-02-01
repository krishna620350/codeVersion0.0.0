import express from "express";
import router from "./router/router.js";

const app = express();
app.use(router);
const port = process.env.PORT || 5002;
app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
});