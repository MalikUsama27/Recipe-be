import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();
connectDB();
//rest object
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Welcome to  Node Server Ecommerce App</h1>");
  });
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

//port
const PORT = process.env.PORT || 8080;

//Listen
app.listen(PORT, () => {
  console.log(
    `Serrver Running on PORT.... ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
    // .bgMagenta.white
  );
});
