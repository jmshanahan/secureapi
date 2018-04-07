const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb://localhost/auth'); 


//app setup
app.use(morgan('combined'));
//enable cors for all domains
// option to only open up to specific domain
app.use(cors());
app.use(bodyParser.json({type:'*/*'}));
router(app);

//server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port, () => {console.log(`Server listening on ${port}`)});
