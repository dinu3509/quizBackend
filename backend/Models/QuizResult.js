const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const QuizResultSchema = new Schema({
    quizId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    topic:{
        type:String
    },
    score:{
        type:Number
    },
    wrong:{
        type:Number
    },total:{
        type:Number
    },
    accuracy:{
        type:Number
    },selected: {
        type: Map,
        of: String, // or `of: Schema.Types.Mixed` if you want nulls allowed
        default: {}
    },answers: {
        type:[String],
        default:[]
    }, questions: {
    type: [Schema.Types.Mixed],  // Use Mixed to support open-ended and MCQs
    required: true
  },
    time: {
    type: Date,
    default: Date.now
}
})
const quizModel = mongoose.model('QuizResult',QuizResultSchema);

module.exports = quizModel