const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
//halaman register
router.get ('/form', (req, res) => {
    res.render('form');
});
//registrasi akun
router.post('/form', (req, res) => {
    const {username, email, password} = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query,[username, email, hashPassword], (err, result) => {
        if (err) throw err;
        res.redirect('/auth/login');
    });
});
router.get('/halaman', (req, res) => {
    res.render('halaman');
})
//halaman utama
router.get('/index', (req, res) => {
    res.render('index');
});
//halaman login
router.get('/login', (req, res) => {
    res.render('login');
});
//login akun
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.redirect('/auth/index');   
            } else {
                res.send('Password yang anda masukkan salah!');
            }
        }else{
            res.send('username tidak ditemukan!');
        }
    });    
});
//halaman profil user

router.get('/profil', (req, res) => {
    if (req.session.user) {
        res.render('profil', {user: req.session.user});
    } else {
        res.redirect('/auth/login');
    }
});
//edit profil user
router.get('/lengkapi', (req, res) => {
    if (req.session.user) {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [req.session.user.id], (err, result) => {
            if (err) throw err;
            const user = result[0];
            res.render('lengkapi', {user: user, hasil: 'Data berhasil diupdate!'});
        });
    } else {
        res.redirect('/auth/profil');
    }
});

//menyimpan data diri baru
router.post('/lengkapi', (req, res) => {
    const {NIM, nama, telepon} = req.body;
    const query = 'UPDATE users SET NIM = ?, nama = ?, telepon = ? WHERE id = ?';
    db.query(query, [NIM, nama, telepon, req.session.user.id], (err, result) => {
        if (err) throw err;
        res.redirect('/auth/profil');
    });
});
router.get('/lengkapi', (req, res) => {
    if (req.session.user) {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [req.session.user.id], (err, result) => {
            if (err) throw err;
            const user = result[0];
            res.render('lengkapi', {user: user, hasil: ''});
        });
    } else {
        res.redirect('/auth/profil');
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/halaman');
})
module.exports = router;

