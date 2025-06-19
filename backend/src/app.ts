import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocs from "./swagger-output.json";
import dotenv from "dotenv"
dotenv.config({
  path: "./.env",
});

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS?.split(",");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.static("public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

import healthRoutes from "./routes/healthCheck.route";
import authRoutes from "./routes/auth.route";
import problemRoutes from "./routes/problem.route";
import executeCode from "./routes/executeCode.route";
import submissionRoutes from "./routes/submission.route";
import playlistRoutes from "./routes/playlist.routes";
import discussionRoutes from "./routes/discussion.route"
import contestRoutes from "./routes/contest.route";
import webHooksRoutes from "./routes/webhooks.route";
import aiServicesRoutes from './routes/aiServices.route';
import serverRoutes from "./routes/server.route"


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute/code", executeCode);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/discuss",discussionRoutes);
app.use("/api/v1/contests",contestRoutes);
app.use("/api/v1/webhook",webHooksRoutes);
app.use("/api/v1/auth/ai",aiServicesRoutes)
app.use("/api/v1",serverRoutes);
app.use(errorHandler);

export { app };
