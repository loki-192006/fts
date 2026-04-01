const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash("error", "Please login to continue");
  res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") return next();
  req.flash("error", "Admin access required");
  res.redirect("/dashboard");
};

const isGuest = (req, res, next) => {
  if (!req.session.user) return next();
  return req.session.user.role === "admin"
    ? res.redirect("/admin/dashboard")
    : res.redirect("/dashboard");
};

module.exports = { isAuthenticated, isAdmin, isGuest };
