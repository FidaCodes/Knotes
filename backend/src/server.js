import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

//to start using variables inside your .env file
dotenv.config();

//this creates an express app
const app = express();

const PORT = process.env.PORT || 5001;

//getting and resolving the path of current directory /backend/src
const __dirname = path.resolve();

//a middleware that parses json bodies (access to req.body)
app.use(express.json());

//use cors only if the node env inside out env file is not set to production
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    }),
  );
}

//a custom middleware that logs the method and its url
// app.use((req, res, next) => {
//   console.log(
//     `Request method is: ${req.method} and request URL is: ${req.url}`,
//   );
//   next();
// });

//creating a default common route that uses all the other routes
//all endpoints will start from /api/notes
app.use("/api/notes", rateLimiter, notesRoutes);
// app.use(rateLimiter);

//If the node env variable is set to production, serve the static assets under dist folder (index.html file)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//connect to the mongodb database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on PORT: ", PORT);
  });
});
