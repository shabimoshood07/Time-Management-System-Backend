import session from "express-session";
import userModel from "../model/userModel.js";

// signup new user
export const registerUser = async (req, res, next) => {
  try {
    const newUser = await userModel.create({ ...req.body });
    req.session.authenticated = true;
    req.session.role = newUser.role;
    req.session.userId = newUser._id;
    req.session.user = newUser.username;
    res.status(201).json({
      username: newUser.username,
      id: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

// User login
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(403).json({ mesage: "Invalid login" });

  const user = await userModel.findOne({ username: username });

  if (!user) return res.status(404).json({ mesage: "user no found" });

  const checkPassword = await user.comparePassword(password);

  if (!checkPassword)
    return res.status(401).json({ mesage: "Invalid login credentials" });
  req.session.authenticated = true;
  req.session.role = user.role;
  req.session.userId = user._id;
  req.session.user = user.username;
  console.log(req.session.id);
  res.status(201).json({
    username: user.username,
    id: user._id,
  });
};

// User logout
export const logout = async (req, res) => {
  try {
    // delete session from database
    await req.sessionStore.destroy(req.session.id);

    // destroy session
    req.session.destroy((err) => {
      if (err) throw err;
      res.clearCookie(process.env.SESSION_NAME);
      res.json({ message: "Logged out successfully." });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getUser = async (req, res) => {
  const user = req.session.user;
  const founduser = await userModel.findOne({ username: user });
  res.json(founduser);
};
