import {mongoose} from "mongoose"
const taskSchema = new mongoose.Schema({
    "name":{
        type:String,
    },
    "description":{
        type:String,

    },
    "duration_in_hrs":{
         type:Number,
    },
    "team":{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    },
    "type":{
        type:String,
    },
    "user":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },


},
{
    timestamp:true,
})
const Task = mongoose.model("Task", taskSchema);
export{Task};