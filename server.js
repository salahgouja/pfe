const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const path = require("path");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const playlistRoute = require("./routes/playlistRoute");
const coursRoute = require("./routes/coursRoute");

const userRoute = require("./routes/userRoute");

const superAdminRoute = require("./routes/superAdminRoute");
const conservatoireRoute = require("./routes/conservatoireRoute");
const teacherRoute = require("./routes/teacherRoute");

const authRoute = require("./routes/authRoute");

// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());
app.use("/api/v1/assets", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.use("/api/v1/cours", coursRoute);
app.use("/api/v1/playlists", playlistRoute);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/superAdmin", superAdminRoute);
app.use("/api/v1/user/conservatoire", conservatoireRoute);
app.use("/api/v1/user/teacher", teacherRoute);

app.use("/api/v1/auth", authRoute);

// //err handling middleware (turned as json instead of html )
// app.use((err,req,res,next)=>{
// res.status(400).json({err});
// });
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});
