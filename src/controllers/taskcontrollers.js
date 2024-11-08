import {AsyncHandler} from  "../utils/AsyncHandler.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
//import{User} from "../models/users.models.js"
import { Task } from "../models/taskmodels.js"
const createTask = AsyncHandler(async(req,res)=>{
    const {name, description, duration_in_hrs , type} = req.body;
    if(!name || !description || !duration_in_hrs || !type)
    {
        throw new ApiError(400 , "Provide all  task details")
    }
    const teamId = req.params.teamId;
    const userId = req.user._id;
    
    const existedTask = await Task.findOne(
        {
            $and:[
                {user:userId},
                {name:name}
            ]
        }
    );
    if(existedTask)
    {
        throw new ApiError(400, "Task already exists")
    }
    const newTask  = await Task.create({
          name:name,
          description:description,
          duration_in_hrs:duration_in_hrs,
          type:type,
          user:userId
    })
    if(!newTask)
    {
       
        throw new ApiError(400 ,"Task creation failed")
    }
    return(res.status(200).send(new ApiResponse(200  ,"Task created successfully")));

})
const updateTask =  AsyncHandler(async(req,res)=>{
    const {oldName , newName, description, duration_in_hrs , type} = req.body;
    const userId = req.user_id;
    if(!oldName || !userId)
    {
        throw new ApiError(400 , "Old name of task and UserId required for task updation")
    }
    const existingTask = await Task.findOne(

        {
            $and:[
                {user:userId},
                {name:oldName}
            ]
        }

    )
    if(!existingTask)
    {
        throw new ApiError(400 , "Task does not exist");
    }
    if(newName)
    {
         existingTask.name = newName;
    }
    if(description)
    {
        existingTask.description = description;
    }
    if(duration_in_hrs)
    {
        existingTask.duration_in_hrs  = duration_in_hrs;
    }
    if(type)
    {
        existingTask.type = type;
    }
    const updatedTask = await existingTask.save();
    if(!updatedTask)
    {
        throw new ApiError(400 , "Task updation not successful")
    }
    return(res.status(200).send(new ApiResponse(200  ,"Task updation successfully")));
    
})
const deleteTask = AsyncHandler(async(req,res,next)=>{
    const {name} = req.body;
    const  userId = req.params.userId;
    if(!name || !userId)
    {
        throw new ApiError(400 ,"Task name and userId required")
    }
    const existingTask = await Task.deleteOne(
        {
            $and:[
                {user:userId},
                {name:name}
            ]
        }
    )
    if(!existingTask)
    {
        throw new ApiError(400,"Task deletion failed")
    }
    return(res.status(200).send(new ApiResponse(200  ,"Task deletion successfully")));
    

})
export{createTask , updateTask,deleteTask};