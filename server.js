const express = require('express');
const httpFactory = require('./http');
const socketFactory = require('./socket');
const connection = require('./tests/helpers/db');

const users = [];
const app = express();

httpFactory(app, express);
const { ioServer } = socketFactory(connection, app, users);

ioServer.listen(3000, () => { console.log('Socket.io listening on 4555'); });
