require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/admin", require("./src/routes/admin"));
app.use("/api/verif", require("./src/routes/verifikator"));
app.use("/api/izin", require("./src/routes/izin"));
// // fallback 404
// app.use('*', (_,res)=>res.status(404).json({message:'Not Found'}));

// // global error
// app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server on http://localhost:${process.env.PORT}`)
);
