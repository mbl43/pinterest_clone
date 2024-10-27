var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const upload = require("./multer");
// This helps users login
const localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const Users = await userModel.findOne({
    username: req.session.passport.user,
  })
  .populate("posts")
  res.render("profile", { Users });
});

router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      res.status(404).send("no files given");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      image: req.file.filename,
      imagetext: req.body.caption,
      user: user._id,
    });
    
     user.posts.push(post._id);
     await user.save();
    res.redirect("/profile");
  }
);

// Register Route
router.post("/register", function (req, res) {
  const { username, fullName, email } = req.body;
  const userData = new userModel({ username, fullName, email });

  userModel
    .register(userData, req.body.password)
    .then(function () {
      // Authenticate the user after successful registration
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile"); // Redirecting to the profile page after registration
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

// Login Route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Profile Route
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.send("This is the profile page"); // Fixed argument order to (req, res)
});

// Logout Route
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }
    
    res.redirect("/"); // Redirect to the home page or wherever you want
  });
});

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
