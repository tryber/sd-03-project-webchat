const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');



app.use('/client', express.static(path.join(__dirname, '/index.html'), { extensions: ['html'] }));


http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});