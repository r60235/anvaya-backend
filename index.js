const express = require('express');
const cors = require("cors");
const connectDB = require('./db/connection.db');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// connect to DB
connectDB();