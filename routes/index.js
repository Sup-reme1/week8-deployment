const express = require('express');
const dbServer = require('../config/db');
const router = express.Router();

function isAuthenticated(req, res, next){
    if (req.session.userId){
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const query = `SELECT username FROM users WHERE user_id = ?`;
    dbServer.query(query, [userId], (err, result) => {
        if (err) throw err;
        const username = result[0].username;
        console.log(username);
    })
    // const loggedin = !!reg.session.userid;
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

module.exports = router;
