import Work from "../model/workSchema.js";
import userModel from "../model/userModel.js";
export const addWork = async (req, res, next) => {
  const user = req.session.userId;
  const role = req.session.role;
  const { endWork, startWork, description, date } = req.body;

  if (!endWork || !startWork || !description || !date)
    return res.status(500).json({ message: "Enter all input field" });
  try {
    const newStartDate = new Date();
    const newEndtDate = new Date();

    newStartDate.setHours(startWork.split(":")[0]);
    newStartDate.setMinutes(startWork.split(":")[1]);

    newEndtDate.setHours(endWork.split(":")[0]);
    newEndtDate.setMinutes(endWork.split(":")[1]);

    console.log(newEndtDate, newStartDate);

    if (newEndtDate == "Invalid Date" || newStartDate == "Invalid Date")
      return res.status(500).json({ message: "Invalid time" });

    // let startWork = newStartDate;
    // let endWork = newEndtDate;

    let dateCheck = new Date(req.body.date).toISOString();
    const dayExistsAlready = await Work.findOne({
      date: dateCheck,
      user: user,
    });

    if (dayExistsAlready)
      return res.status(403).json({
        message:
          "It appears that you have added a work description for this date",
      });
    // date = new Date(req.body.date);
    const newWork = await Work.create({
      ...req.body,
      date,
      startWork: newStartDate,
      endWork: newEndtDate,
      user,
      role,
    });
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

      let date = work.date.toDateString();
      let start = work.startWork.toTimeString();
      let end = work.endWork.toTimeString();

      console.log(date);
      console.log(start);
      console.log(end);
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

export const deleteWork = async (req, res, next) => {
  const { workId } = req.params;
  try {
    if (req.session.role === "user") {
      const userId = req.session.userId;
      const work = await Work.findOneAndDelete({ _id: workId, user: userId });
      if (!work)
        return res.status(404).json({
          message: `No work found with id: ${workId} or unauthorized`,
        });
      res.status(200).json({ message: "Work deleted successfully" });
    }
    if (req.session.role === "manager") {
      const work = await Work.findOneAndDelete({
        _id: workId,
        role: { $in: ["user", "manager"] },
      });
      if (!work)
        return res.status(404).json({
          message: `No work found with id: ${workId} or unauthorized`,
        });
      res.status(200).json({ message: "Work deleted successfully" });
    }
    if (req.session.role === "admin") {
      const work = await Work.findOneAndDelete({
        _id: workId,
      });
      res.status(200).json({ message: "Work deleted successfully" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateWork = async (req, res, next) => {
  const { workId } = req.params;
  try {
    const update = {};
    for (const [key, value] of Object.entries(req.body)) {
      update[key] = value;
    }

    if (update["startWork"]) {
      let newStartDate = new Date();
      newStartDate.setHours(req.body.startWork.split(":")[0]);
      newStartDate.setMinutes(req.body.startWork.split(":")[1]);
      console.log(newStartDate);
      update["startWork"] = newStartDate;
    }
    if (update["endWork"]) {
      let newEndtDate = new Date();
      newEndtDate.setHours(req.body.endWork.split(":")[0]);
      newEndtDate.setMinutes(req.body.endWork.split(":")[1]);
      console.log(newEndtDate);
      update["endWork"] = newEndtDate;
    }

    if (
      update["endWork"] == "Invalid Date" ||
      update["startWork"] == "Invalid Date"
    )
      return res.status(500).json({ message: "Invalid time" });

    console.log(update);

    if (req.session.role === "user") {
      const userId = req.session.userId;
      const updatedDocument = await Work.findOneAndUpdate(
        { _id: workId, user: userId },
        update,
        { runValidators: true, new: true }
      );

      if (!updatedDocument)
        return res
          .status(404)
          .json({ message: "No work found or unauthorized" });

      res.status(200).json(updatedDocument);
    }
    if (req.session.role === "manager") {
      const userId = req.session.userId;
      const updatedDocument = await Work.findOneAndUpdate(
        { _id: workId, user: $in[("user", "manager")] },
        update,
        { runValidators: true, new: true }
      );

      if (!updatedDocument)
        return res
          .status(404)
          .json({ message: "No work found or unauthorized" });

      res.status(200).json(updatedDocument);
    }
    if (req.session.role === "admin") {
      const userId = req.session.userId;
      const updatedDocument = await Work.findOneAndUpdate(
        { _id: workId },
        update,
        { runValidators: true, new: true }
      );

      if (!updatedDocument)
        return res
          .status(404)
          .json({ message: "No work found or unauthorized" });

      res.status(200).json(updatedDocument);
    }
  } catch (error) {
    next(error);
  }

  // if (req.body.startWork) {
  //   let newStartDate = new Date();
  //   newStartDate.setHours(req.body.startWork.split(":")[0]);
  //   newStartDate.setMinutes(req.body.startWork.split(":")[1]);
  // }
  // if (req.body.endWork) {
  //   let newEndtDate = new Date();
  //   newEndtDate.setHours(req.body.endWork.split(":")[0]);
  //   newEndtDate.setMinutes(req.body.endWork.split(":")[1]);
  // }

  // console.log(newEndtDate, newStartDate);

  // if (newEndtDate == "Invalid Date" || newStartDate == "Invalid Date")
  //   return res.status(500).json({ message: "Invalid time" });

  // let startWork = newStartDate;
  // let endWork = newEndtDate;
  // try {
  //   if (req.session.role === "user") {
  //     const userId = req.session.userId;
  //     const updatedWork = await Work.findOneAndUpdate(
  //       {
  //         _id: workId,
  //         user: userId,
  //       },
  //       { ...req.body },
  //       { runValidators: true, new: true }
  //     );

  //     res.status(200).json(updatedWork);
  //   }
  //   if (req.session.role === "manager") {
  //     const updatedWork = await Work.findOneAndUpdate(
  //       {
  //         _id: workId,
  //         role: { $in: ["user", "manager"] },
  //       },
  //       { ...req.body },
  //       { runValidators: true, new: true }
  //     );

  //     res.status(200).json(updatedWork);
  //   }
  //   if (req.session.role === "admin") {
  //     const updatedWork = await Work.findOneAndUpdate(
  //       {
  //         _id: workId,
  //       },
  //       { ...req.body },
  //       { runValidators: true, new: true }
  //     );

  //     res.status(200).json(updatedWork);
  //   }
  // } catch (error) {
  //   next(error);
  // }
};

export const preferredWorkingHour = async (req, res, next) => {
  const { day, from, to } = req.body;
  try {
    if (req.session.role === "user") {
      const userId = req.session.userId;

      const user = await userModel.findById(userId).select("-password");
      if (!user)
        return res
          .status(404)
          .json({ message: `No user with id:${userId} found` });

      if (user.preferredWorkingHour.length === 0) {
        user.preferredWorkingHour.push({ day, from, to });
        await user.save();
        return res.status(200).json(user);
      }

      const updateUser = user.preferredWorkingHour.find(
        (item) => item.day === day
      );
      if (updateUser) {
        updateUser.from = from;
        updateUser.to = to;
      } else {
        user.preferredWorkingHour.push({ day, from, to });
      }
      await user.save();
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};
