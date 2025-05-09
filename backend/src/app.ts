import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));

import authRoutes from "./routes/auth.route";
import problemRoutes from "./routes/problem.route"
import executeCode from "./routes/executeCode.route"
import submissionRoutes from "./routes/submission.route"


app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problem",problemRoutes)
app.use("/api/v1/execute/code",executeCode);
app.use("/api/v1/submission",submissionRoutes)
app.use(errorHandler);

export { app };
