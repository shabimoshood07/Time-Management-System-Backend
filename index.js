import express from "express";
import dotenv from "dotenv";
import authRouter from "./router/authRouter.js"
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
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    // cookie: { secure: true, httpOnly: true },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      //   mongoOptions: advancedOptions
    }),
  })
);

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: true, httpOnly: true },
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//       serialize: (session) => {
//         // Extract the session data from the session object
//         const sessionData = {
//           user: session.user,
//           token: session.token,
//           authenticated: session.authenticated,
//         };

//         // Set the session data as the value of the session key in the database
//         return { session: JSON.stringify(sessionData) };
//       },
//       deserialize: (session) => {
//         // Parse the session data from the value of the session key in the database
//         const sessionData = JSON.parse(session.session);

//         // Create a new session object and set its properties to the parsed session data
//         const newSession = {
//           user: sessionData.user,
//           token: sessionData.token,
//           authenticated: sessionData.authenticated,
//         };

//         // Return the new session object
//         return newSession;
//       },
//     }),
//   })
// );

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/session", (req, res) => {
  res.json(req.session);
});

// app.get("/session", async (req, res) => {
//   const sessionId = req.session.id;
//   console.log(sessionId);
//   const sessionData = await req.sessionStore.get(sessionId);
//   res.json(sessionData);
// });

// app.get("/session/:sessionId", async (req, res) => {
//   const { sessionId } = req.params;
//   console.log(sessionId);
//   await req.sessionStore.get(sessionId, (error, sessionData) => {
//     if (error) throw error;
//     res.json(sessionData);
//   });
// });

// app.get("/session", (req, res) => {
//   const sessionId = req.session.id;
//   console.log(sessionId);
//   res.json(req.session);
// });

app.use("/api/v1/auth", authRouter);

app.use((err, req, res, next) => {
  let status = err.status || 500;

  res.status(status).json({ message: err.mesage });
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
