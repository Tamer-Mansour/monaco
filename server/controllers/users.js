const User = require("../models/User");
const Question = require("../models/Question");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { title, description, codeSnippet } = req.body;

    const question = new Question({
      title,
      description,
      codeSnippet,
    });

    await question.save();

    res
      .status(201)
      .json({ message: "Question created successfully", question });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit an answer to a question
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const { userId } = req.user;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    question.answers.push({
      studentId: userId,
      answer,
    });

    await question.save();

    res.status(201).json({ message: "Answer submitted successfully" });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/// Get a student's answer to a question
const getStudentAnswer = async (req, res) => {
    try {
      const { id, studentId } = req.params;
  
      const question = await Question.findById(id);
  
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      const answer = question.answers.find((ans) => ans.studentId.toString() === studentId);
  
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found' });
      }
  
      res.json(answer);
    } catch (error) {
      console.error('Error fetching student answer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createQuestion,
    getAllQuestions,
    getQuestionById,
    submitAnswer,
    getStudentAnswer,
  };