// const userServices = require('../services/userServices');

// const registerUser = (io) => async (req, res) => {
//   const { nickname, color = 'black' } = req.body;
//   const newUser = await userServices.createUser(nickname, color);
//   if (newUser.error) return res.status(409).json(newUser.message);
//   io.emit('createdUser', newUser);
//   console.log('usuario criado', newUser);
//   return res.status(201).json(newUser);
// };

// module.exports = {
//   registerUser,
// };
