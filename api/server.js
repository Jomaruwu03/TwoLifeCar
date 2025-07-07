require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use("/api", require("./routes/leadRoutes"));

app.listen(process.env.PORT, () => console.log(`🚀 API en http://localhost:${process.env.PORT}`));
