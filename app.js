require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const Games = require("./routes/Games");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public")); //SERVES STATIC FILES
app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));

const dbUrl = process.env.DB_URL;

const secret = process.env.SECRET || "metalgearsolid";

const mongoClientPromise = new Promise((resolve) => {
  mongoose.connection.on("connected", () => {
    const client = mongoose.connection.getClient();
    resolve(client);
  });
});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  clientPromise: mongoClientPromise,
  touchAfter: 24 * 3600,
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialize: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// FOR AUTHENTICATION
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//START PASSPORT AND INITIATE AUTHENTICATE
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//SETUPS SESSION IN AND OUT
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.session);
  next();
});

app.use("/", Games);

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Mongo Error");
    console.log(err);
  });
mongoose.set("strictQuery", true);

app.listen(3000, () => {
  console.log("Listening in port 3000");
});
