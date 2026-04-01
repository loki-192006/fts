const User = require("../models/User");

exports.getRegister = (req, res) => {
  res.render("auth/register", { title: "Register - ForexPro" });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/register");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "Email already registered");
      return res.redirect("/auth/register");
    }
    const user = await User.create({ name, email, password });
    req.flash("success", "Account created! Please login.");
    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error", "Registration failed: " + err.message);
    res.redirect("/auth/register");
  }
};

exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login - ForexPro" });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/auth/login");
    }
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance
    };
    req.flash("success", "Welcome back, " + user.name + "!");
    if (user.role === "admin") return res.redirect("/admin/dashboard");
    res.redirect("/dashboard");
  } catch (err) {
    req.flash("error", "Login failed");
    res.redirect("/auth/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};
