const Quiz = require('../Models/quiz');
const QuizResult = require('../Models/QuizResult');
const DetailResultModel = require('../Models/DetailResult');

// Fetch quiz questions
const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.quiz; // from ensureQuizToken
    const quiz = await Quiz.findById(quizId);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.status(200).json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Check if user already submitted this quiz
const checkSubmission = async (req, res) => {
  try {
    const { quizId, userId } = req.quiz; // from ensureQuizToken

    const existingResult = await Quiz.findOne({  _id: quizId, user: userId });
    console.log(existingResult.submitted)
    res.status(200).json({ submitted: existingResult.submitted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Submit quiz result
const postResult = async (req, res) => {
  try {
    const { quizId, userId } = req.quiz; // from ensureQuizToken
    const { score, wrong, total, accuracy, topic, selected, answers, questions } = req.body;

    // Check if already submitted
    const existingResult = await QuizResult.findOne({ quiz: quizId, user: userId });
    if (existingResult) {
      return res.status(403).json({ message: "You have already submitted this quiz." });
    }

    // Save QuizResult
    const quizResultDoc = new QuizResult({
      quizId: quizId,
      userId: userId,
      score,
      wrong,
      total,
      accuracy,
      topic,
      selected,
      answers
    });

    // Save detailed result
    const detailResultDoc = new DetailResultModel({
      quizId: quizId,
      selected,
      answers,
      questions
    });

    await quizResultDoc.save();
    await detailResultDoc.save();

    // Optionally mark quiz as submitted
    await Quiz.findByIdAndUpdate(quizId, { submitted: true });

    res.status(201).json({
      message: "Result saved successfully",
      result: quizResultDoc
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getQuizById, checkSubmission, postResult };
