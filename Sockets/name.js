const onChangeName = (_, { Users }) => async (nickname) => {
  await Users.markAsOnline(nickname);
};

module.exports = {
  onChangeName,
};
