import { Router } from "express";
import rateLimit from "express-rate-limit";
import { userController } from "../controller/usersController.js";
import { API_RATE_LIMIT_HEADERS, API_RATE_LIMIT_REQUEST, API_RATE_LIMIT_TIME } from "../configuration/envConfig.js";
const usersRouter = new Router();
// Parse rate limit settings from environment variables
const windowMs = parseInt(API_RATE_LIMIT_TIME, 10); // 15 minutes
const maxRequests = parseInt(API_RATE_LIMIT_REQUEST, 10); // Limit to 100 requests per 15 minutes
const headersEnabled = API_RATE_LIMIT_HEADERS === "true"; // Convert to boolean

// Define specific rate limit for user-related routes
const userApiLimiter = rateLimit({
  windowMs, // Time window in milliseconds
  max: maxRequests, // Max number of requests per window
  message: { error: "Request limit reached. Please try again later." },
  headers: headersEnabled, // Use parsed boolean for headers option
});

// Timeout middleware
function timeoutMiddleware(timeout) {
  return (req, res, next) => {
    // Set a timer for the request
    const timer = setTimeout(() => {
      // Respond with a timeout error if the request exceeds the specified timeout duration
      res.status(503).json({ error: "Request timed out. Please try again later." });
    }, timeout);

    // Clear the timer if the response finishes before timeout
    res.on("finish", () => clearTimeout(timer));
    next();
  };
}

// Apply rate limiter middleware to the route
usersRouter.get("/", timeoutMiddleware(5000), userApiLimiter, userController.getUsers);
usersRouter.get("/:id", timeoutMiddleware(5000), userApiLimiter, userController.getUsersByid);
usersRouter.post("/create", timeoutMiddleware(5000), userApiLimiter, userController.createUser);

export default usersRouter;
