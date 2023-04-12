import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "please provide working day"],
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },

  from: {
    type: String,
    required: true,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please provide a valid start time in the format HH:mm",
    ],
  },
  to: {
    type: String,
    required: true,
    match: [
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Please provide a valid end time in the format HH:mm",
    ],
  },
});

export default workingHoursSchema;
