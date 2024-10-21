const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (!req.session.user && req.path !== '/auth/halaman' && req.path !== '/auth/login' && req.path !== '/auth/form' && req.path !== '/auth/index') {
        return res.redirect('/auth/halaman');
    } else if (req.session.user && req.path === '/') {
        return res.redirect('/auth/index');
    }
    next();
});

app.use('/auth', authRoutes);
app.get('/auth/index', (req, res) => {
    if (req.session.user) {
        return res.render('index', { message: '' });
    } else {
        return res.redirect('/auth/login');
    }
});



app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


