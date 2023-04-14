import Work from "../model/workSchema.js";

export const addWork = async (req, res, next) => {
  const user = req.session.userId;
  const role = req.session.role;
  const dayExistsAlready = await Work.findOne({
    date: req.body.date,
    user: user,
  });

  if (dayExistsAlready)
    return res.status(403).json({
      message:
        "It appears that you have added a work description for this date",
    });
  try {
    const newWork = await Work.create({ ...req.body, user, role });
    res.status(201).json(newWork);
  } catch (error) {
    next(error);
  }
};

export const getAllWork = async (req, res) => {
  if (req.session.role === "user") {
    const userId = req.session.userId;
    const allWork = await Work.find({ user: userId });
    res.status(200).json(allWork);
  }
  if (req.session.role === "manager") {
    const allWork = await Work.find({ role: { $in: ["user", "manager"] } });
    res.status(200).json(allWork);
  }
  if (req.session.role === "admin") {
    const allWork = await Work.find({});
    res.status(200).json(allWork);
  }
};

export const getWork = async (req, res, next) => {
  const { workId } = req.params;

  try {
    if (req.session.role === "user") {
      const userId = req.session.userId;
      const work = await Work.findOne({ _id: workId, user: userId });
      if (!work)
        return res
          .status(404)
          .json({ message: `No work with id ${workId} found` });

      res.status(200).json(work);
    }
    if (req.session.role === "manager") {
      const work = await Work.findOne({
        _id: workId,
        role: { $in: ["user", "manager"] },
      });
      if (!work)
        return res
          .status(404)
          .json({ message: `No work with id ${workId} found` });
      res.status(200).json(work);
    }
    if (req.session.role === "admin") {
      const work = await Work.findOne({ _id: workId });
      if (!work)
        return res
          .status(404)
          .json({ message: `No work with id ${workId} found` });
      res.status(200).json(work);
    }
  } catch (error) {
    next(error);
  }
};
