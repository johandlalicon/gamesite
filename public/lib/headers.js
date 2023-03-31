const requestOptions = {
  queryMethod: "body",
  method: "POST",
  baseURL: "https://api.igdb.com/v4",
  headers: {
    Accept: "application/json",
    "Client-ID": process.env.IGDB_ID,
    Authorization: `Bearer ${process.env.IGDB_AUTH}`,
  },
  responseType: "json",
};

module.exports = requestOptions;
