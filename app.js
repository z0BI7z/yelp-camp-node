var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var dotenv = require("dotenv");
// var seedDB = require("./seedDB");

// env variables
dotenv.config();

// routes
var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

// database
var url =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://user1:${process.env.MONGODB_PASS}@cluster0.xt6af.mongodb.net/yelp_camp?retryWrites=true&w=majority`
    : "mongodb://localhost:27017";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  });
// seedDB();

// setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// passport
app.use(
  require("express-session")({
    secret: "hello kuchi",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

// set variable with the user information
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// listen
app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log(("env", process.env.NODE_ENV));
  console.log("Yelp Camp server started!");
});
