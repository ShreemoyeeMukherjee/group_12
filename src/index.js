import mongoose from "mongoose"
import {connectDB} from "./db/index.js"
import dotenv from "dotenv"
dotenv.config();
import {app} from "./app.js"
///import {userRouter} from "./routes/users.routes.js"

connectDB()
.then(()=>
{
   
   app.listen(process.env.PORT||5000, ()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
   })
})
.catch((err)=>
{
  console.log(err);
})