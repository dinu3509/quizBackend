const QuizResult = require('../Models/DetailResult');

const getResultById = async (req, res) => {
  try {
    const quizId = req.params.id;   // quiz result ID from URL

    const result = await QuizResult.find({quizId:quizId});

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getResultById };
