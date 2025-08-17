const QuizResultModel = require('../Models/QuizResult');
const getResultsByUserId = async(req,res)=>{
    const userId = req.user._id;
    try{
const results =await QuizResultModel.find({userId})
return res.status(201).json({message:"Found History",results})
    }catch(err){
        return res.status(500).json({message:"Internal Server Error"})
    }
    
}
module.exports = getResultsByUserId