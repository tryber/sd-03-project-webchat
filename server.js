const socketFunction = require('./Sockets');
const start = require('./index');
const Container = require('./container');
const Services = require('./Services');
const Models = require('./Models');
// const getRouters = require('./Routers');

const { PORT } = process.env;

const config = {
  PORT,
};

const container = new Container(
  {
    start,
    params: ['config', 'socketFunction'],
  },
  {
    config: { object: config },
    socketFunction: { object: socketFunction },
    Models: { object: Models, params: ['config'] },
    Services: { object: Services, params: ['Models'] },
  },
);

container.start();
