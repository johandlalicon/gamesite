function getDates(monthsToAdd = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
  return Math.round(date.getTime() / 1000);
}

function convertUnix(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthDayYearString = `${month} ${day}, ${year}`;
  return { monthDayYearString, year };
}

module.exports = { getDates, convertUnix };
