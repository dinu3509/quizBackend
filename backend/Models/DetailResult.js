const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const DetailResultSchema = new Schema({
    quizId : {type:Schema.Types.ObjectId},
    selected : {
        type:Map
    },
    answers : {
       type: [String],
        of: String
    },questions: {
        type: [Schema.Types.Mixed],  // Use Mixed to support open-ended and MCQs
        required: true
      }
})
const DetailResultModel = mongoose.model('DRM',DetailResultSchema);

module.exports
 = DetailResultModel;