const express = require('express');
const http = require('http');
const UUID = require('uuid/v4');
const logger = require('./src/utils/logger');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);

const chatMessages = [];
const chatUsers = [];
let clients = [];
const sessions = {};

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use(cookieParser());
app.use(express.static('public'));

app.locals.errors = [];
app.locals.userEmail = [];
app.locals.user = {};

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', (req, res) => {
    if (req.cookies.isLoggedIn === 'true') {
        res.redirect('/chat-login');
    }
    else {
        res.render('index', {
            chatMessages,
        });
    }

});

app.get('/chat-login', (req, res) => {
    if (req.cookies.isLoggedIn === 'true') {
        res.render('chatLogin', {
            chatMessages,
        });
    }
    else {
        res.redirect('/');
    }

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/chat', (req, res) => {
    res.status(200).send(chatMessages);
});


app.get('/chat/new_message', (req, res) => {
    clients.push(res);
});



app.post('/registration', (req, res) => {
    const {email, password, passwordConfirm} = req.body;
    const errors = [];
    const hasUser = chatUsers.some((userRecord) => {
        return userRecord.email === email;
    });

    if (hasUser) {
        errors.push('This user already exists!');
    }

    if (password !== passwordConfirm) {
        errors.push('Password does not match!');
    }

    if (errors.length) {
        return res.render('registration', {
            errors,
        });
    }

    else {
            chatUsers.push({
            email,
            password,
        });

        res.redirect('/login');
    }

});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    const user = chatUsers.find((userRecord) => {
        return userRecord.email === email && userRecord.password === password;
    });

    if (typeof user === 'undefined') {
        res.render('login', {
            errors: ['This user does not exist'],
        });
    }
    else {
        res.cookie('isLoggedIn', 'true', {
            httpOnly: true,
        });

      const sessionId = UUID();
      sessions[sessionId] = user.email;

        res.redirect('/chat-login');
    }

});


app.post('/chat', upload.fields([]), (req, res) => {
    const msg = Object.assign({
        id: UUID(),
    }, req.body.message);

    chatMessages.push(msg);

    logger.info('Created message', msg);

    clients.forEach(client => {
        return client.status(200).send(msg);
    });

    clients = [];

    res.status(201).send(msg);
});


server.listen(3000, () => {
    logger.info('Started listening on port 3000');
});


