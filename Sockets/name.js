const onChangeName = (socket, { Users }) => async (nickname) => {
  await Users.markAsOnline(socket.id, nickname);
};

module.exports = {
  onChangeName,
};
