const Quiz = require('../Models/quiz');
const QuizResult = require('../Models/QuizResult')
const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const alreadySubmitted = await QuizResult.findOne({ quizId});
    if (alreadySubmitted) {
      return res.status(403).json({ 
        message: 'You have already submitted this quiz.',
        submitted: true 
      });
    }

    res.status(200).json({ quiz, submitted: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getQuizById };
