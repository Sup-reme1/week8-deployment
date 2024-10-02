const express = require('express');
const bcrypt = require('bcryptjs');
const PORT = 8001;
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const usersRouter =  require('./routes/users');

require('dotenv').config;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: ';lskapdkfa[kfasldfAPE',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

// Route to serve login.html page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'login.html'));
  });
// Route to serve Register.html page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'register.html'));
  });

// Route to serve add_expense.html page
app.get('/add_expense', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'add_expense.html'));
});

// Route to serve edit_expense.html page
app.get('/edit_expense', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'edit_expense.html'));
});

// Route to serve view_expense.html page
app.get('/view_expense', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'view_expense.html'));
});


// Route to handle login and register Form data
app.use('/api', usersRouter);

//Route to handle index.html page
app.use('/', indexRouter);



app.listen(PORT, (err) => {
    console.log(`Server Running on port ${PORT}`);
})



// ### Testing Backend API Endpoints using Postman:
// Install and set up Postman for testing backend API endpoints.
// Create collections and requests in Postman to test various API endpoints of your expense tracking application
// Test CRUD operations, authentication, and error handling functionalities of the backend API.