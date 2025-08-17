const { ref, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuizSchema = new Schema({
 topic: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  number: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },questions: {
        type: [Schema.Types.Mixed],  // Use Mixed to support open-ended and MCQs
        required: true
      },
  submitted: { type: Boolean, default: false }
  
}, { timestamps: true }); 
const quizModel = mongoose.model('Quiz',QuizSchema);

module.exports
 = quizModel;