const auth = (req, res, next) => {
  const sessionId = req.session.id;
  if (!sessionId) {
    return res.status(401).json({ message: "inavlid auth" });
  } else {
    console.log(req.session);
    next();
  }
};

export default auth;
