const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/users.json'); // Path to the users.json file

// Utility function to get users from the JSON file
const getUsers = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([])); // Create an empty file if not found
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Utility function to save users to the JSON file
const saveUsers = (users) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing to users file:', error);
  }
};

// Route to get all users
router.get('/', (req, res) => {
  const users = getUsers();
  res.render('users', { users });
});

// Route to add a new user
router.post('/add', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send('Name and email are required!');
  }

  const users = getUsers();
  users.push({ name, email });
  saveUsers(users);

  res.redirect('/users');
});

// Route to delete a user by index
router.post('/delete/:index', (req, res) => {
  const users = getUsers();
  const index = parseInt(req.params.index, 10);

  if (isNaN(index) || index < 0 || index >= users.length) {
    return res.status(400).send('Invalid user index!');
  }

  users.splice(index, 1);
  saveUsers(users);

  res.redirect('/users');
});

module.exports = router;