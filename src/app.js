import express from "express"
import bodyParser from "body-parser"
const app = express();
app.use(express.json());
import {userRouter} from "../src/routes/userroutes.js"
import { taskRouter } from "../src/routes/taskroutes.js"
app.use("/api/v1/users",userRouter);
app.use("/api/v1/tasks",taskRouter);
export{app};