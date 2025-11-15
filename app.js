const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
require("dotenv").config();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");

const corsOptions = {
  origin: "*",
  methods: "*",
  allowedHeaders: "*",
};

const app = express();
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/doctors", doctorRouter);

// PRODUCTION OR ANY ENV – SIMPLE HOME ROUTE
app.get("/", (req, res) => {
  res.send("Doctor Appointment API is running...");
});

// HANDLE UNDEFINED ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
