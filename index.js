// 
//        ___  _______  __    _  _______  _______    _______  ___  
//       |   ||   _   ||  |  | ||       ||       |  |   _   ||   | 
//       |   ||  |_|  ||   |_| ||    ___||_     _|  |  |_|  ||   | 
//       |   ||       ||       ||   |___   |   |    |       ||   | 
//    ___|   ||       ||  _    ||    ___|  |   |    |       ||   | 
//   |       ||   _   || | |   ||   |___   |   |    |   _   ||   | 
//   |_______||__| |__||_|  |__||_______|  |___|    |__| |__||___|                                            
//
// Janet AI - Website Gallery & API
// Created by: @IGSteven
//
const path = require('path');
global.basedir = __dirname;
global.url = 'http://localhost:5656';

//global.datadir = `${basedir}/../../live_bot/data`;
global.datadir = "C:/Miners/xmrig/xmrig-6.16.2/bin/selfai/live_bot/data";

const express = require('express');
const session = require('express-session')
const passport = require('passport');
const { datadir } = require('./config');
const port = process.env.PORT || 5656;
const app = express();
global.config = require('./config');

app.get('/ping', (req, res) => {
    res.send('Pong');
});

// Logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(session({
    secret: 'janetai',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1', require(`${basedir}/src/routes/api/v1`));

// After API use PUG for page UI rendering
app.set('view engine', 'ejs')
app.get('/', (req, res) => { 
    res.render('index', { title: 'Home' });
});
app.use('/gallery', require(`${basedir}/src/routes/gallery`));
app.use('/images', require(`${basedir}/src/routes/images`));
app.use('/favicon.ico', (req, res) => {
    res.sendFile(`${basedir}/src/static/favicon.ico`);
});

app.listen(port, () => {
    console.log(`JanetAI Website now running on port ${port}`);
});
