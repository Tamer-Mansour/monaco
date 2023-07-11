const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
    required: true,
  },
  answers: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
