import dotenv from "dotenv";
dotenv.config();

export const API = process.env.API;
export const API_RATE_LIMIT_TIME = process.env.API_RATE_LIMIT_TIME;
export const API_RATE_LIMIT_REQUEST = process.env.API_RATE_LIMIT_REQUEST;
export const API_RATE_LIMIT_HEADERS = process.env.API_RATE_LIMIT_HEADERS;
export const PORT = process.env.PORT || 5000;
