const { string, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionModel = new Schema(
    {
        id :{
            type:String,
            required:true
        },
        question :{
            type:String,
            required:true
        },
        answer :{
            type:String,
            required:true
        },
        gameId :{
            type:String,
            required:true
        },
        options:{
            
        }
    }
)