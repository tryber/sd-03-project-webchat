const onChangeName = ({ id }, { Users }) => async (nickname) => {
  await Users.markAsOnline(id, nickname);
};

module.exports = {
  onChangeName,
};
