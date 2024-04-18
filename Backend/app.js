import express from 'express';
import { config } from "dotenv"



const app = express();
config({path: "./Config/config.env"});







export default app;
