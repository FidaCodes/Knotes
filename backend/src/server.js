import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

//to start using variables inside your .env file
dotenv.config();

//this creates an express app
const app = express();

const PORT = process.env.PORT || 5001;

//a middleware that parses json bodies (access to req.body)
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(rateLimiter);

//a custom middleware that logs the method and its url
// app.use((req, res, next) => {
//   console.log(
//     `Request method is: ${req.method} and request URL is: ${req.url}`,
//   );
//   next();
// });

//creating a default common route that uses all the other routes
//all endpoints will start from /api/notes
app.use("/api/notes", notesRoutes);

//connect to the mongodb database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on PORT: ", PORT);
  });
});
