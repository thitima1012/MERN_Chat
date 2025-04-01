import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRouter from "./routes/auth.router.js";
import messageRouter from "./models/message.model.js";
import friendRouter from "./routes/friend.router.js";



const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;

//create app
app.use(express.json());
app.use(cookieParser());
//allow web can connect app
//origin=BASE_URL: allow web can connect to app
app.use(cors({ 
    origin: FRONTEND_URL, 
    credentials: true 
}));


app.get("/", (req, res) => {
  res.send("<h1>RESTFUL  SERVICE FOR MREN CHAT PROJECT</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friend", friendRouter);


server.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();
});