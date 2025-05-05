import { app } from "./app";
import dotenv from "dotenv";
// import connectDB from "./db";


dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT ?? 8000;
// connectDB();

app.get("/",(req,res)=>{

  res.send("Welcome to leetlab 🔥");
})

import authRoutes from "./routes/auth.route";
import problemRoutes from "./routes/problem.route"
import { errorHandler } from "./middleware/error.middleware";

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problem",problemRoutes)
app.use(errorHandler);
app.listen(PORT, () => {
 console.log(`Server is running on port: ${PORT}`);
});
