import mongoose from "mongoose";

const connect = async (url) => {
  return mongoose.connect(url);
};

export default connect;
