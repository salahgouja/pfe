const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config({ path: "config.env" });
const path = require("path");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

const brandRoute = require("./routes/brandRoute");

const reunionRoute = require("./routes/reunionRoute");
const productRoute = require("./routes/productRoute");
const playlistRoute = require("./routes/playlistRoute");
const coursRoute = require("./routes/coursRoute");

const userRoute = require("./routes/userRoute");

const superAdminRoute = require("./routes/superAdminRoute");
const conservatoireRoute = require("./routes/conservatoireRoute");
const teacherRoute = require("./routes/teacherRoute");

const authRoute = require("./routes/authRoute");
const contactusRoute = require("./routes/contactusRoute");

const paymentRoute = require("./routes/paymentRoute");
// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares

app.use(cors());
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies
app.use(bodyParser.json());

app.use(express.json());
app.use("/api/v1/assets", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// ...
// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.use("/api/v1/cours", coursRoute);
app.use("/api/v1/playlists", playlistRoute);
app.use("/api/v1/reunions", reunionRoute);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/superAdmin", superAdminRoute);
app.use("/api/v1/conservatoire", conservatoireRoute);
app.use("/api/v1/teacher", teacherRoute);

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/contactus", contactusRoute);

app.use("/api", paymentRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

// ...

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
