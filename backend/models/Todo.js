const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    desription:{
        type:String,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium'
    }
},{
    timestamps:true,
})
module.exports = mongoose.model('Todo',todoSchema);