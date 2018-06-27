// Starting point of the application

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser'); // parses incoming requests
const morgan = require('morgan'); // logging framework
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
// DB Setup
mongoose.connect('mongodb://localhost:27017/auth');

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*'})); // parses any incoming request into a JSON
router(app);

// Server Setup
const port = process.env.PORT || 6090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);