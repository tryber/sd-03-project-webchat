const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Users = require('./model/userModel')

const app = express();
app.use(bodyParser.json());

app.use('/', express.static('./public', { extensions: ['html'] }));

const { PORT = 3000 } = process.env;

const server = http.createServer(app);

const io = socketIo(server);


app.post('/message', (req, res) => {
  const { chatMessage } = req.body;
  const { nickname } = req.params;

  io.emit('message', nickname+' '+ chatMessage);
  res.status(200).json({ ok: true })
});

server.listen(PORT, () => {
  console.log(`Ouvindo na porta ${PORT}`);
});

/* mongoose.connect('mongodb://localhost:27017/webchat',{useUnifiedTopology:true},
    function(err){
        if(err){
            throw err
        }
        console.log('Database connected')
}); */
