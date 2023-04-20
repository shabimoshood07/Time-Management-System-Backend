import express from "express";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js";
import workRouter from "./router/workRouter.js";
import connect from "./connectDB/connect.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: true,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/work", workRouter);

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/session", (req, res) => {
  res.json(req.session);
});

app.use((err, req, res, next) => {
  if (err) {
    let status;
    let message;
    status = err.statusCode || 500;
    message = err.message;
    // console.log("errors", err);
    // console.log("errors", err.name);
    // console.log("errors", err.type);

    if (err.code === 11000) {
      status = 500;
      message = `${err.keyValue.username} has been taken`;
    }

    // Customize error message for validation errors
    if (err.name === "ValidationError") {
      message = Object.values(err.errors)
        .map((error) => error.message)
        .join(", ");
    }
    if (err.name === "CastError") {
      message = `Invalid id: ${err.value}`;
    }

    res.status(status).json({ message: message });
  }
});
const port = process.env.PORT || 5000;

const start = async () => {
  await connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
      console.log("started");
    });
  });
};

start();
