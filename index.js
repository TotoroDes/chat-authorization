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

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use(cookieParser());
app.use(express.static('public'));

app.locals.errors = [];
app.locals.userEmail = [];


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
    res.cookie('isLoggedIn', 'true', {
        httpOnly: true,
    });

    res.render('chatLogin', {
        chatMessages,
    });
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

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    res.redirect('/chat-login');
});

app.post('/registration', (req, res) => {
    const {email, password, passwordConfirm} = req.body;
    if(password !== passwordConfirm){
        res.render('registration', {
            errors: ["Password don't match!"],

        });
    }
    else{
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


