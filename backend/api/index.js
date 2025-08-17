const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

require('../Models/db'); 

const AuthRouter = require('../routes/AuthRouter');
const Quiz = require('../routes/QuizCreate');
const Write = require('../routes/WriteQuiz');
const History = require('../routes/History');
const Result = require('../routes/Result');
const Profile = require('../routes/Profile');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', AuthRouter);
app.use('/quiz', Quiz);
app.use('/writequiz', Write);
app.use('/history', History);
app.use('/results', Result);
app.use('/profile', Profile);

app.get('/', (req, res) => {
  res.send('HI Dinesh');
});

// Run server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
