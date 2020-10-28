module.exports = (date) => {
  const day = date.getDate().toString();
  const dayFormat = (day.length === 1) ? `0${day}` : day;

  const month = (date.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
  const mouthFormat = (month.length === 1) ? `0${month}` : month;

  const anoFormat = date.getFullYear();

  const hour = date.getHours().toString();
  const hourFormat = (hour.length === 1) ? `0${hour}` : hour;

  const minute = date.getMinutes().toString();
  const minuteFormat = (minute.length === 1) ? `0${minute}` : minute;

  const second = date.getSeconds().toString();
  const secondFormat = (second.length === 1) ? `0${second}` : second;

  return `${dayFormat}-${mouthFormat}-${anoFormat} ${hourFormat}:${minuteFormat}:${secondFormat}`;
};
