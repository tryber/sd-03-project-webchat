const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/post', (req, res) => {
  const { name } = req.body;

});
 
io.on('connection', (socket) => {
  console.log('Conectado');
  socket.on('disconnect', () => {
    console.log('Desconectado');
  });
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
