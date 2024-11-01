const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');

// Middleware
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Import database connection and user model
require("./db");
require("./model/user");
require("./model/AcneAnalysis");
require("./model/AcneTreatment");

// Routes
const authRoutes = require('./routes/authroutes');
app.use(authRoutes); // If you want to prefix, use: app.use("/api", authRoutes);



// Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
