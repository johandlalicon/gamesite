const express = require("express");
const router = express.Router();

const apicalypse = require("apicalypse").default;
const axios = require("axios").default;
const requestOptions = require("../public/lib/headers");
const isLoggedIn = require("../public/lib/isLoggedIn");
const {
  getGameData,
  getPlatformData,
  addConsoleType,
  getPublisherAndVideo,
  getPopularGames,
} = require("../public/lib/apiHelpers");

const { updateImg, resizeImg } = require("../public/lib/imgUtils");
const { convertUnix, getDates } = require("../public/lib/dateUtils");
const gamingSystems = require("../public/lib/gamingSys");

const passport = require("passport");
const Review = require("../models/review");
const User = require("../models/user");

// ************************* HOME PAGE ************************* //

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const gamesCollection = await getPopularGames();
    const userReviews = await Review.find({}).populate("user_id");
    const popularGames = gamesCollection[0].result;
    const upcomingGames = gamesCollection[1].result;

    for (let i = 0; i < upcomingGames.length; i++) {
      const { monthDayYearString } = convertUnix(
        upcomingGames[i].first_release_date
      );
      upcomingGames[i].first_release_date = monthDayYearString;
      upcomingGames[i].cover.url = resizeImg(
        upcomingGames[i].cover.url,
        "thumb"
      );
    }
    for (let i = 0; i < userReviews.length; i++) {
      userReviews[i].game_cover = resizeImg(userReviews[i].game_cover, "thumb");
    }
    console.log(userReviews[0].user_id.username);
    if (req.user) {
      const userData = await User.findById(user._id);
      const wishlist = userData.games.wishlist.map((game) => game.gameId);
      const playing = userData.games.playing.map((game) => game.gameId);
      const backlog = userData.games.backlog.map((game) => game.gameId);
      const completed = userData.games.completed.map((game) => game.gameId);
      const favorite = userData.games.favorite.map((game) => game.gameId);
      res.render("home", {
        user,
        popularGames,
        upcomingGames,
        userReviews,
        wishlist,
        playing,
        backlog,
        favorite,
        completed,
      });
    } else {
      res.render("home", {
        popularGames,
        upcomingGames,
        user,
        userReviews,
        messages: req.flash("success"),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//***************************************************************************//

// ************************* GAME PAGE ************************* //

router.get("/game/:id", async (req, res) => {
  const gameId = req.params.id;
  const user = req.user;
  try {
    const reviews = await Review.find({ game_id: gameId }).populate("user_id");
    const gameInfo = await getGameData(gameId);

    const videoId = gameInfo.videos[gameInfo.videos.length - 1];

    gameInfo.platforms.forEach((element, index, array) => {
      array[index] = String(element);
    });

    let bgImg = [];
    gameInfo.screenshots.forEach((img) => {
      const newImg = resizeImg(img.url, "1080p");
      bgImg.push(newImg);
    });

    let gameConsoles = [];

    for (const [key, value] of Object.entries(gamingSystems)) {
      if (gameInfo.platforms.includes(key)) {
        gameConsoles.push({ key, value });
      }
    }
    gameInfo.gameConsoles = gameConsoles;

    const involvedCompanies = gameInfo.involved_companies;
    let companyIdList = [];
    involvedCompanies.forEach((el, i) => {
      companyIdList.push(gameInfo.involved_companies[i].company);
    });
    companyIdList = companyIdList.join(", ");

    const publisherVideoData = await getPublisherAndVideo(
      companyIdList,
      videoId
    );
    const publisherName = publisherVideoData.data[0].result;
    const gameVideos = publisherVideoData.data[1].result;

    if (req.user) {
      const userData = await User.findById(user._id);
      const wishlist = userData.games.wishlist.map((game) => game.gameId);
      const completed = userData.games.completed.map((game) => game.gameId);
      const playing = userData.games.playing.map((game) => game.gameId);
      const backlog = userData.games.backlog.map((game) => game.gameId);
      const favorite = userData.games.favorite.map((game) => game.gameId);
      res.render("game", {
        gameInfo,
        gameConsoles,
        bgImg,
        publisherName,
        gameVideos,
        user,
        reviews,
        user,
        wishlist,
        playing,
        backlog,
        favorite,
        completed,
      });
    } else {
      res.render("game", {
        gameInfo,
        gameConsoles,
        bgImg,
        publisherName,
        gameVideos,
        user,
        reviews,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//***************************************************************************//

// ************************* PLATFORM PAGE ************************* //

router.get("/platform/:id/", (req, res) => {
  const platformId = req.params.id;
  getPlatformData(platformId).then((data) => {
    const topGames = data[0].result;
    const recentGames = data[1].result;
    const upcomingGames = data[2].result;

    for (let i = 0; i < topGames.length; i++) {
      topGames[i].screenshots.forEach((img) => {
        img.url = resizeImg(img.url, "1080p");
      });

      const { monthDayYearString } = convertUnix(
        topGames[i].first_release_date
      );
      topGames[i].first_release_date = monthDayYearString;
    }

    for (let i = 0; i < recentGames.length; i++) {
      recentGames[i].game.cover.url = resizeImg(
        recentGames[i].game.cover.url,
        "720p"
      );
      upcomingGames[i].game.cover.url = resizeImg(
        upcomingGames[i].game.cover.url,
        "720p"
      );
    }
    res.render("platform", {
      topGames,
      recentGames,
      upcomingGames,
      platformId,
      gamingSystems,
    });
  });
});

//***************************************************************************//

// ************************* LOGIN PAGE ************************* //

router.get("/user/", (req, res) => {
  if (req.isAuthenticated()) {
    const returnTo = req.session.returnTo || "/";
    console.log(returnTo);
    delete req.session.returnTo;
    return res.redirect(returnTo);
  }
  res.render("users/login", {
    messages: req.flash("error"),
  });
});

router.post(
  "/user/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/user",
  }),
  (req, res) => {
    res.redirect("/");
  }
);
//***************************************************************************//

// ************************* USER DASHBOARD  ************************* //
router.get("/user/dashboard", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  try {
    const userData = await User.findById(userId);
    const reviewData = await Review.find({ user_id: userId });
    const favorite = userData.games.favorite;

    res.render("users/profile", {
      userData,
      reviewData,
      favorite,
    });
  } catch (error) {
    console.log(error);
  }
});

// ************************* GET GAMES COLLECTION ************************* //
router.get("/user/games/:action", async (req, res) => {
  const action = req.params.action;
  const userId = req.user._id;
  try {
    const userData = await User.findById(userId);
    const gameList = userData.games[action];
    console.log(userData);
    res.status(200).send({
      gameList,
      message: action,
    });
  } catch (error) {
    console.log(error);
  }
});

//***************************************************************************//

// ************************* REGISTRATION PAGE ************************* //

router.post("/user/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username }); //INSTANCE OF USER MODEL
    const registeredUser = await User.register(user, password); //HASH USER & PW THANKS PASSPORT
    registeredUser.push;

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user");
  }
});

//***************************************************************************//

// ************************* ADD/REMOVE COLLECTION ************************* //
router.post("/add-games/:action", async (req, res) => {
  const userId = req.user._id;
  const action = req.params.action;
  const gameData = req.body.data;

  try {
    const userData = await User.findById(userId);
    const gameList = userData.games[action];

    const index = gameList.findIndex(
      (game) => game.gameId === parseInt(gameData.gameId)
    );
    if (index === -1) {
      gameList.push(gameData);
      await userData.save();
    } else {
      gameList.splice(index, 1);
      await userData.save();
    }

    console.log(userData);
    res.status(200).send({
      message: action,
    });
  } catch (error) {
    console.log(error);
  }
});
//***************************************************************************//

// ************************* CREATE REVIEW ************************* //

router.post("/new-review", isLoggedIn, async (req, res) => {
  try {
    const { gameId, gameName, gameCover, rating, review_text } = req.body;
    const user = req.user._id;
    const review = new Review({
      game_id: gameId,
      game_name: gameName,
      game_cover: gameCover,
      user_id: user,
      rating: rating,
      review_text: review_text,
    });
    await review.save();
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// ************************* EDIT REVIEW ************************* //

router.get("/edit-review/:id", async (req, res) => {
  const reviewId = req.params.id;
  try {
    const reviewData = await Review.findById(reviewId);
    res.json(reviewData);
    console.log("EDIT ROUTE A");
  } catch (err) {
    console.log(err);
  }
});

router.patch("/edit-review/:id", async (req, res) => {
  const { gameId, reviewId, rating, review_text } = req.body;
  try {
    await Review.findByIdAndUpdate(reviewId, {
      gameId,
      rating,
      review_text,
    });
    console.log("EDIT ROUTE B");
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    console.log(err);
  }
});

//***************************************************************************//

// ************************* LIKE/DISLIKE ************************* //

router.post("/add-like/:id", isLoggedIn, async (req, res) => {
  console.log(req.body);
  const reviewId = req.params.id;
  const userId = req.user._id;
  try {
    const hasDisliked = await Review.findOne({
      _id: reviewId,
      "dislikes.voter": userId,
    });
    if (hasDisliked) {
      await Review.updateOne(
        {
          _id: reviewId,
        },
        {
          $pull: {
            "dislikes.voter": { $in: userId },
          },
          $inc: { "dislikes.count": -1 },
        }
      );
    }
    const result = await Review.updateOne(
      {
        _id: reviewId,
      },
      {
        $pull: { "likes.voter": { $in: userId } },
      }
    );
    if (result.modifiedCount > 0) {
      await Review.updateOne(
        { _id: reviewId },
        { $inc: { "likes.count": -1 } }
      );
    } else {
      await Review.updateOne(
        { _id: reviewId },
        {
          $inc: { "likes.count": 1 },
          $push: { "likes.voter": userId },
        }
      );
    }
    const reviewData = await Review.findById(reviewId);
    const totalLikes = reviewData.likes.count;
    const totalDislikes = reviewData.dislikes.count;
    res.status(200).send({
      message: "liked",
      totalDislikes: totalDislikes,
      totalLikes: totalLikes,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-dislike/:id", isLoggedIn, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user._id;
  try {
    const hasLiked = await Review.findOne({
      _id: reviewId,
      "likes.voter": userId,
    });
    if (hasLiked) {
      await Review.updateOne(
        {
          _id: reviewId,
        },
        {
          $pull: {
            "likes.voter": { $in: userId },
          },
          $inc: { "likes.count": -1 },
        }
      );
    }
    const result = await Review.updateOne(
      {
        _id: reviewId,
      },
      {
        $pull: { "dislikes.voter": { $in: userId } },
      }
    );

    if (result.modifiedCount > 0) {
      await Review.updateOne(
        { _id: reviewId },
        { $inc: { "dislikes.count": -1 } }
      );
    } else {
      await Review.updateOne(
        { _id: reviewId },
        {
          $inc: { "dislikes.count": 1 },
          $push: { "dislikes.voter": userId },
        }
      );
    }
    const reviewData = await Review.findById(reviewId);
    const totalDislikes = reviewData.dislikes.count;
    const totalLikes = reviewData.likes.count;
    res.status(200).send({
      message: "disliked",
      totalDislikes: totalDislikes,
      totalLikes: totalLikes,
    });
  } catch (err) {
    console.log(err);
  }
});

//***************************************************************************//

// ************************* SEARCH PAGE ************************* //
router.get("/search", async (req, res) => {
  const gameQuery = req.query.game;
  try {
    const searchResults = await getGameData(gameQuery);

    for (let i = 0; i < searchResults.length; i++) {
      searchResults[i].cover.url = resizeImg(
        searchResults[i].cover.url,
        "thumb"
      );
      const { year } = convertUnix(searchResults[i].first_release_date);
      searchResults[i].first_release_date = year;
    }
    res.render("search", { searchResults });
  } catch (error) {
    console.log(error);
  }
});

//***************************************************************************//

router.delete("/delete-review/:id", async (req, res) => {
  const reviewId = req.params.id;
  const gameId = req.body.gameId;
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/game/${gameId}`);
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
});

module.exports = router;
