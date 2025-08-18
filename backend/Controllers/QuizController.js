const Quiz = require('../Models/quiz');
const { strict_output } = require('../gpt.js');
const jwt = require("jsonwebtoken");

const quizControl = async (req, res) => {
  try {
    const { topic, number, type, time } = req.body;
    const uid = req.user._id;

    let questions;

    // Multiple Choice
    if (type === "Multiple Choice") {
      questions = await strict_output(
        `You are a helpful AI that generates multiple choice questions.
Each question should have:
- one correct answer (not more than 15 words),
- three wrong but plausible options (each under 15 words),
- the correct answer must be **one of the options**.`,
        new Array(number).fill(`Generate a hard multiple-choice question about ${topic}`),
        {
          question: "question",
          answer: "correct answer (must match exactly one option)",
          option1: "first option (max 15 words)",
          option2: "second option (max 15 words)",
          option3: "third option (max 15 words)",
          option4: "fourth option (max 15 words)"
        }
      );

      // filter invalid questions
      questions = questions.filter(q =>
        q.question && q.answer &&
        [q.option1, q.option2, q.option3, q.option4].includes(q.answer)
      );
    }

    // Fill in the Blank
    else if (type === "Fill in the Blank") {
      questions = await strict_output(
        `You are a helpful AI that generates fill-in-the-blank questions.
Each question should have:
- exactly one blank (___),
- one correct answer (max 3 words).`,
        new Array(number).fill(`Generate a fill in the blank question about ${topic}`),
        {
          question: "fill-in-the-blank question with ___",
          answer: "correct answer (max 3 words)"
        }
      );

      questions = questions.filter(q => q.question && q.answer);
    }

    // Match the Following
    else if (type === "Match The Pairs") {
    questions = await strict_output(
    `You are a helpful AI that generates 'Match the Following' questions.
Each question must have:
- A clear instruction as "Match the following"
- At least 3 pairs.
- Format output strictly in JSON.`,
    new Array(number).fill(`Generate a match-the-following question about ${topic}`),
    {
      question: "match the following question",
      leftItems: ["item 1", "item 2", "item 3"],
      rightItems: ["match 1", "match 2", "match 3"]
    }
  );

  // validate
  questions = questions.filter(q =>
    q.question &&
    Array.isArray(q.leftItems) &&
    Array.isArray(q.rightItems) &&
    q.leftItems.length >= 3 &&
    q.rightItems.length >= 3 &&
    q.leftItems.length === q.rightItems.length
  );
}

    // If no valid type
    else {
      return res.status(400).json({ message: "Invalid quiz type", success: false });
    }

    // Save quiz
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: 'No valid questions generated. Please try again.',
        success: false
      });
    }

    const newQuiz = new Quiz({
      topic, number, type, time, user: uid, questions, submitted: false
    });

    await newQuiz.save();

    const quizToken = jwt.sign(
      { quizId: newQuiz._id, userId: uid },
      process.env.JWT_SECRET,
      { expiresIn: `${number}m` }
    );

    res.status(201).json({
      message: 'Quiz Created Successfully',
      quiz: newQuiz,
      questions,
      quizToken
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error', success: false });
  }
};

module.exports = quizControl;
