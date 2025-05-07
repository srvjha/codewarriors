import { app } from "./app";
import dotenv from "dotenv";


dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT ?? 8000;


app.get("/",(req,res)=>{
  res.send("Welcome to CodeWarriors 🔥");
})

app.listen(PORT, () => {
 console.log(`Server is running on port: ${PORT}`);
});
