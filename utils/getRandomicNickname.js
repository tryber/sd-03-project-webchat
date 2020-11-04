// Fonte: https://gist.github.com/6174/6062387

const getRandomicNickname = () => Math.random().toString(36).substring(2, 10);

module.exports = getRandomicNickname;
