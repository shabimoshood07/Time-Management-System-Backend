import mongoose from "mongoose";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: [true, "Please provide a username"],
    min: [6, "username should be at least 6 characters"],
    max: [10, "username should no be more than 10 characters"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    min: [6, "username should be at least 6 characters"],
    max: [15, "username should no be more than 15 characters"],
  },
  role: {
    type: String,
    enum: ["user", "manager", "admin"],
    require: [true, "Please provide a role"],
    default: "user",
  },
});

// Hash passowrd
userSchema.pre("save", async function () {
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (inputPassword) {
  const match = await bycrypt.compare(inputPassword, this.password);
  return match;
};


//Generate Token
userSchema.methods.generateToken = async function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

export default mongoose.model("UserSchema", userSchema);
