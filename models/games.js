const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Game = new Schema({
  fave: {
    gameId: {
      type: Number,
      required: true,
      user: Objec,
    },
    name: String,
    cover: String,
  },
  completed: {
    gameId: {
      type: Number,
      required: true,
      user: Objec,
    },
    name: String,
    cover: String,
  },
});
// module.exports = mongoose.model("Game", gameSchema);
