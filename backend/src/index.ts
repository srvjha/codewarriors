import { app } from "./app";
import dotenv from "dotenv";
import { logger } from "./configs/logger";


dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT ?? 8000;


app.get("/",(req,res)=>{
  res.send("Welcome to CodeWarriors 🔥");
})

app.listen(PORT, () => {
 logger.info(`Server is running on port: ${PORT}`);
});
