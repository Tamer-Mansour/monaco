// Import required dependencies and models
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create an instance of the Express app
const app = express();

// Configure body-parser middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/monaco", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User model
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String,
});
// Define the Question model
const Question = mongoose.model("Question", {
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
        ref: "User",
      },
      answer: {
        type: String,
        required: true,
      },
      codeSnippet: {
        type: String,
      },
    },
  ],
});
// login
app.post("/login", async (req, res) => {
    console.log("hereeeeeeeeeeee")
  const { email, password } = req.body;

  try {
    // Find the user with the given email
    const user = await User.findOne({ email });
    console.log(user._id + "<<<<<<<<<<<<<<")
    if (!user || user.password !== password) {
        console.log("not found")
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the user details
    res.json({ message: "Login successful", user });
    console.log(user._id);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//logout
app.post("/logout", (req, res) => {
  req.session.destroy(); // Clear the session

  res.status(200).json({ message: "Logout successful" });
}); 

// Create a new user
app.post("/users", (req, res) => {
  const { name, email, password, role } = req.body;

  const newUser = new User({ name, email, password, role });

  newUser
    .save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get all users
app.get("/users", (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Update a user
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  User.findByIdAndUpdate(id, { name, email, password, role }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user: updatedUser });
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// 8888888888888888888888888888888888888888888888888888

// Create a new question
app.post("/questions", (req, res) => {
  const { title, description, codeSnippet } = req.body;

  const newQuestion = new Question({ title, description, codeSnippet });

  newQuestion
    .save()
    .then(() => {
      res.status(201).json({ message: "Question created successfully" });
    })
    .catch((error) => {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get all questions
app.get("/questions", (req, res) => {
  Question.find()
    .then((questions) => {
      res.json(questions);
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get a question by ID
app.get("/questions/:id", (req, res) => {
  const { id } = req.params;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      res.json(question);
    })
    .catch((error) => {
      console.error("Error fetching question:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

/// Submit an answer to a question
app.post("/questions/:id/answers", (req, res) => {
  const { id } = req.params;
  const { answer, codeSnippet } = req.body;
  const { userId } = req.user;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const userAnswer = {
        studentId: userId,
        answer: answer,
        codeSnippet: codeSnippet, // Add the codeSnippet to the user's answer
      };

      question.answers.push(userAnswer);

      return question.save();
    })
    .then(() => {
      res.status(201).json({ message: "Answer submitted successfully" });
    })
    .catch((error) => {
      console.error("Error submitting answer:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Get a student's answer to a question
app.get("/questions/:id/answers/:studentId", (req, res) => {
  const { id, studentId } = req.params;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      const answer = question.answers.find(
        (ans) => ans.studentId.toString() === studentId
      );

      if (!answer) {
        return res.status(404).json({ message: "Answer not found" });
      }

      res.json(answer);
    })
    .catch((error) => {
      console.error("Error fetching student answer:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
