const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes"); // Import user routes
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

connectDb();
const app = express();

const port = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Enable credentials for cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Use the user routes
app.use("/api/contacts", require("./routes/contractsRoutes"));
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
