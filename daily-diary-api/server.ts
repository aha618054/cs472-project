import express from "express";
import cors from "cors";
import { notFoundRouteHandler } from "./controllers/common.controller";
import { errorHandler, logRequest } from "./middlewares/middleware";
import postRouter from "./routes/posts/post.routes";
import inquiryRouter from "./routes/inquiries/inquiry.routes";
import "dotenv/config";

// initial application
const server = express();

// configuration
server.use(cors());

// middleware
server.use(logRequest);
server.use("/api/posts", postRouter);
server.use("/api/inquiries", inquiryRouter);

// routers
server.all("*", notFoundRouteHandler);

// error handlers
server.use(errorHandler);

// bootstrap application
server.listen(8080, () =>
    console.log("Server is running....")
);
