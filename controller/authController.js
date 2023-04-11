import userModel from "../model/userModel.js";

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await userModel.create({ ...req.body });
    req.session.authenticated = true;
    req.session.role = user.role;
    res.status(201).json({
      username: newUser.username,
      id: newUser._id,
      session: req.session,
    });
  } catch (error) {
    next(error);
  }
};

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
  res.status(201).json({
    username: user.username,
    id: user._id,
    session: req.session,
  });
};

export const getUser = async (req, res) => {
  const { username } = req.body;

  const founduser = await userModel.findOne({ username });
  res.json(founduser);
};
