import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startWork: {
    type: Date,
    required: true,
  },
  endWork: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    min: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    require: true,
  },
  role: {
    type: String,
    required: true,
  },
});

workSchema.pre("save", function (next) {
  console.log(this.endWork - this.startWork);
  this.duration = Math.floor((this.endWork - this.startWork) / 1000 / 60);
  next();
});

workSchema.path("endWork").validate(function (value) {
  return value > this.startWork;
}, "The end time of the work must be after the start time.");

const Work = mongoose.model("Work", workSchema);

export default Work;
