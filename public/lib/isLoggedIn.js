function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      res.status(401).json({ message: "Unauthorized" });
      console.log(req.originalUrl);
    } else {
      const returnUrl = req.query.returnUrl || req.originalUrl;
      req.session.returnTo = req.originalUrl;
      res.redirect("/user");
    }
  } else {
    next();
  }
}
module.exports = isLoggedIn;
