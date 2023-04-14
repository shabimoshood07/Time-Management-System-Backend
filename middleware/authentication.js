const auth = (req, res, next) => {
  const isLoggedIn = req.session.authenticated;
  if (!isLoggedIn) {
    return res.status(401).json({ message: "Please login" });
  } else {
    next();
  }
};

export default auth;
