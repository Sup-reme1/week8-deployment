const express = require('express');
const router = express.Router();
const path = require('path');
const dbServer = require('../config/db');
const bcrypt = require('bcrypt');
const { transcode } = require('buffer');


// api endpoint for register
router.post('/register', async(req,res) => {
    const { username, email, fullname, password } = req.body;
    try{
        // check email validity
        const user = `SELECT * FROM users WHERE email = ?`

        dbServer.query(user, [req.body.email], (err, data) => {
            if (data.length > 0) return res.status(409).json({'message': 'User already exist'});
            
            // hashing the password with hashing techniques
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // storing the data to database with hashed password
            const createNewUser = `INSERT INTO users(email, username, full_name, password) VALUES (?)`
            value = [
                email,
                username,
                fullname,
                hashedPassword
            ]
            dbServer.query(createNewUser, [value], (err, data) => {
                if (err){
                    return res.status(500).json({'message': 'Something went wrong'});
                }
                res.status(200).json({'message': 'login successful', 'redirect': '/login'});
            });
        })
    } catch(err) {
        res.status(500).json({'message': 'Something went wrong'});
    }
});


// api endpoint for login

// NEW ADDED TO HELP WITH REDIRECT
router.post('/login', async(req, res) => {
    console.log('Request body:', req.body);
    // easier way to request the informtion
    const { username, password } = req.body;
    try{
        const user = `SELECT * FROM users WHERE username = ?`

        dbServer.query(user, [username], (err, data) => {
            if (err) throw err;
            if(data.length === 0) {
                return res.status(404).json({'message': 'User not found!'});
            }
            const isPasswordValid = bcrypt.compareSync(password, data[0].password);

            if (!isPasswordValid) {
                return res.status(400).json({'message': 'Invalid email or password'});
            }

            req.session.user = {
                username: data[0].username,
                userId: data[0].user_id
            };

            console.log(req.session.user.userId);

            return res.redirect('/');

        });
    } catch (err) {
        res.status(500).json(err)
    }
});





router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, 
                    username: req.session.user.username, 
                    userId: req.session.user.userId 
                });
    } else {
        res.json({ loggedIn: false });
    }
});






// api endpoint for expenses
router.post('/add_expense', async(req, res) => {
    try{
        const { category, amount, date } = req.body;
        const userId = req.session.user.userId
        
        const addExpense = `INSERT INTO expenses(category, amount, date, user_id ) VALUES (?,?,?,?)`;     
        dbServer.query(addExpense, [category, amount, date, userId ], (err, result) => {
            if (err) throw err;
            console.log('expenses added: ', result);
            return res.redirect('/')
        })
    }catch (err){
        res.status(500);
    }
});

// Added API endpoint to view expenses
router.get('/view_expense', async(req, res) => {
    try{
        if (req.session.user && req.session.user.userId){
            const userId = req.session.user.userId;

            const viewExpense = `SELECT * FROM expenses WHERE user_id = ?`;
            dbServer.query(viewExpense, [userId], (err, result) => {
                if (err) throw err;
                res.status(200).json(result);
            });
        } else {
            res.status(401).json({ message: 'Unauthorized: User not logged in' });
        }

    } catch(err){
        console.error(err);
    }
});

// Added API endpoint to view expenses
router.post('/edit_expense', async(req, res) => {
    const userId = req.session.user.userId;
    const { expense_id, category, date, amount } = req.body; 
    console.log(expense_id, ' + ', category , ' + ', amount, ' + ', date);
    const editExpense = `UPDATE expenses SET category = ?, amount = ?, date = ? WHERE expense_id = ? AND user_id = ?`;
    dbServer.query(editExpense, [category, amount, date, expense_id, userId], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// API for delete expenses
router.delete('/delete_expense', async(req, res) =>{
    const userId = req.session.user.userId;
    const { expense_id } = req.body; 
    const deleteExpense = `DELETE FROM expenses WHERE expense_id = ? AND user_id = ?`;
    dbServer.query(deleteExpense, [expense_id, userId], (err, result) => {
        if (err) throw err;
        res.status(200);

    });
})

module.exports = router;
