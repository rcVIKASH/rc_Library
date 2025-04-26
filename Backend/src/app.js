import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true })); 
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //v1
app.use(cookieParser());

import userRouter from "./routes/user.route.js";

app.use("/api/v1", userRouter);

export { app };
