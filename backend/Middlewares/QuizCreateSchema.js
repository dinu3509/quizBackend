const joi = require('joi');

const QuizCreateSchema = (req, res, next) => {
    const schema = joi.object({
        topic: joi.string().min(3).max(100).required(),
        number: joi.number().integer().min(1).required(),
        type:joi.string().min(1).required(),
        time:joi.string().required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message 
        });
    }

    next(); 
};
module.exports = 
    QuizCreateSchema
    
;
