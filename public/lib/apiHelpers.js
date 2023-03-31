const apicalypse = require("apicalypse").default;
const requestOptions = require("./headers");
const gamingSystems = require("./gamingSys");
const { updateImg, resizeImg } = require("./imgUtils");
const axios = require("axios").default;
const { getDates } = require("./dateUtils");

async function getPopularGames() {
  try {
    const response = await apicalypse(requestOptions)
      .multi([
        apicalypse()
          .query("games", "latest-games")
          .fields("cover.url, release_dates.human,*")
          .limit(20)
          .where(
            `first_release_date > ${getDates(
              -1
            )} & first_release_date <= ${getDates()} & platforms = (167, 169, 130, 6) & aggregated_rating != null & aggregated_rating > 75 & platforms != null`
          )
          .sort("rating asc"),
        apicalypse()
          .query("games", "coming-soon")
          .fields("cover.url,release_dates.human,*")
          .limit(5)
          .where(
            `first_release_date > ${getDates()} & first_release_date < ${getDates(
              2
            )} & platforms = (167, 169, 130, 6) & category = 0`
          )
          .sort("date asc"),
      ])
      .request("/multiquery");
    for (let i = 0; i < response.data.length; i++) {
      updateImg(response.data[i].result);
      addConsoleType(response.data[i].result);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getGameData(gameId) {
  try {
    let request = apicalypse(requestOptions)
      .fields(
        "name, cover.url, screenshots.url, release_dates.human, genres.name, release_dates.y,involved_companies.company,*"
      )
      .limit(30);

    if (isNaN(gameId)) {
      request = request.search(`${gameId}`);
      request = request.where("rating != null");
      const response = await request.request("/games");
      updateImg(response.data);
      return response.data;
    } else {
      request = request.where(`id = (${gameId})`);
      const response = await request.request("/games");
      updateImg(response.data);
      return response.data[0];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getTotalPlatform(platId) {
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/games/count",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": "2aeyadmpjirtzu845l32fou8x9vblm",
        Authorization: "Bearer bce5v3kgx0e5jzcv2rflcx7ewtxvu2",
      },
      data: `where release_dates.platform = ${platId};`,
    });
    return response.data.count;
  } catch (error) {
    console.error(err);
    throw error;
  }
}
function addConsoleType(game) {
  for (let i = 0; i < game.length; i++) {
    game[i].platforms.forEach((element, index, array) => {
      array[index] = String(element);
    });
    game[i].gameConsoles = [];
    for (const [key, value] of Object.entries(gamingSystems)) {
      if (game[i].platforms.includes(key)) {
        game[i].gameConsoles.push({ key, value });
      }
    }
  }
}

async function getPublisherAndVideo(companyIds, videoId) {
  try {
    const response = await apicalypse(requestOptions)
      .multi([
        apicalypse()
          .query("companies", "company-name")
          .fields("name")
          .where(`id = (${companyIds})`),
        apicalypse()
          .query("game_videos", "game-videos")
          .fields("video_id")
          .where(`id = ${videoId}`),
      ])
      .request("/multiquery");

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getPlatformData(platformId) {
  try {
    const response = await apicalypse(requestOptions)
      .multi([
        apicalypse()
          .query("games", "top-games")
          .fields("release_dates.date,cover.url, screenshots.url,*")
          .where(
            `platforms = [${platformId}, 48] & aggregated_rating > 80 & aggregated_rating < 100 & screenshots.url != null`
          )
          .limit(10)
          .sort(`aggregated_rating desc`),

        apicalypse()
          .query("release_dates", "recent-release")
          .fields("game.name,game.cover.url,*")
          .where(
            `game.platforms = [${platformId}] & date <= ${getDates()} & date > ${getDates(
              -1
            )} & game.cover.url != null & game.rating != null`
          )
          .limit(10)
          .sort("date desc"),

        apicalypse()
          .query("release_dates", "coming-soon")
          .fields("game.name,game.cover.url,*")
          .where(
            `platform = (${platformId}) & date > ${getDates()} & game.cover.url != null & game.involved_companies != null`
          )
          .limit(10)
          .sort(`date asc`),
      ])
      .request("/multiquery");

    for (let i = 0; i < response.data.length; i++) {
      updateImg(response.data[i].result);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getGameData,
  getPlatformData,
  getTotalPlatform,
  addConsoleType,
  getPublisherAndVideo,
  getPopularGames,
};
