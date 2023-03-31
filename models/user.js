const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  games: {
    completed: [
      {
        gameId: Number,
        name: String,
        cover: String,
      },
    ],
    wishlist: [
      {
        gameId: Number,
        name: String,
        cover: String,
      },
    ],
    playing: [
      {
        gameId: Number,
        name: String,
        cover: String,
      },
    ],
    backlog: [
      {
        gameId: Number,
        name: String,
        cover: String,
      },
    ],
    favorite: [
      {
        gameId: Number,
        name: String,
        cover: String,
      },
    ],
  },
});

UserSchema.plugin(passportLocalMongoose); //ADDS USERNAME PASSWORD
module.exports = mongoose.model("User", UserSchema);
