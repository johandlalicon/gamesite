const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  game_id: { type: Number, required: true },
  game_name: { type: String, required: true },
  game_cover: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  review_text: { type: String },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },

  likes: {
    count: { type: Number, default: 0 },
    voter: [{ type: Schema.Types.ObjectId, default: null }],
  },
  dislikes: {
    count: { type: Number, default: 0 },
    voter: [{ type: Schema.Types.ObjectId, default: null }],
  },
});

module.exports = mongoose.model("Review", reviewSchema);
