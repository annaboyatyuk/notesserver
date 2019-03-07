'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './api/api.js';

import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(router);

app.use(notFound);
app.use(errorHandler);

let isRunning = false;
let server;

module.exports = {
  start: (port) => {
    if(!isRunning) {
      server = app.listen(port, (err) => {
        if(err) {throw err;}
        isRunning = true;
        console.log('Server is up on port ', port);
      });
    }
    else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close(() => {
      isRunning = false;
      console.log('Server has been stopped');
    });
  },
  server: app,
};