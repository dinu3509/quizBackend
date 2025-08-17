const router = require('express').Router();
const verifyQuizToken = require('../Middlewares/QuizAuth');
const { getQuizById, checkSubmission, postResult } = require('../Controllers/QuizResult');

router.get('/:id', verifyQuizToken, getQuizById);                 // fetch quiz
router.get('/:id/check-submission', verifyQuizToken, checkSubmission); // check if already submitted
router.post('/result', verifyQuizToken, postResult);               // submit result

module.exports = router;
