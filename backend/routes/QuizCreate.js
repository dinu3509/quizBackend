const router = require('express').Router();
const quizValid = require('../Middlewares/QuizCreateSchema');
const ensureAuthenticated = require('../Middlewares/Auth');
const quizControl = require('../Controllers/QuizController')
router.post('/createquiz',ensureAuthenticated,quizValid,quizControl);

module.exports = router;