const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const isAdminMiddleware = require('../middleware/isAdmin');

// Register a new user
router.post('/', usersController.createUser);

// Get all users
router.get('/', usersController.getAllUsers);

// Get a user by ID
router.get('/:id', usersController.getUserById);

// Update a user
router.put('/:id', usersController.updateUser);

// Delete a user
router.delete('/:id', usersController.deleteUser);

// Create a new question
router.post('/questions', authMiddleware, isAdminMiddleware, usersController.createQuestion);

// Get all questions
router.get('/questions', usersController.getAllQuestions);

// Get a question by ID
router.get('/questions/:id', usersController.getQuestionById);

// Submit an answer to a question
router.post('/questions/:id/answers', authMiddleware, usersController.submitAnswer);

// Get a student's answer to a question
router.get('/questions/:id/answers/:studentId', authMiddleware, isAdminMiddleware, usersController.getStudentAnswer);

module.exports = router;
