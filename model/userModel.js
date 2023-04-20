import mongoose from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import workingHoursSchema from "./workingHours.js";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "Please provide a username"],
    minlength: [5, "username should be at least 5 characters"],
    maxlength: [15, "username should no be more than 15 characters"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: [6, "password should be at least 6 characters"],
    maxlength: [15, "password should no be more than 15 characters"],
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    require: [true, "Please provide a role"],
    default: "user",
  },
  preferredWorkingHour: [workingHoursSchema],
});


// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  const match = await bycrypt.compare(inputPassword, this.password);
  return match;
};

export default mongoose.model("UserSchema", userSchema);
