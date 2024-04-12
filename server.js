
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// Middleware
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/todo')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

// Define Todo model
const Todo = mongoose.model('Todo', {
  text: String
});

// Routes

// GET all todos
app.get('/todos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const todos = await Todo.findById(id);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new todo
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a todo
app.delete('/todos/:id', async (req, res) => {
  const id = req.params.id;
  console.log('Deleting todo with ID:', id);
  try {
    console.log(id);
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Todo not found' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Start the server
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
