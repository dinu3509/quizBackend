const jwt = require("jsonwebtoken");

const ensureQuizToken = (req, res, next) => {
  const token = req.headers['authorization']; // frontend sends quizToken in Authorization header

  if (!token) {
    return res.status(401).json({ message: "Quiz token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.quiz = decoded; // { quizId, userId, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired quiz token" });
  }
};

module.exports = ensureQuizToken;
