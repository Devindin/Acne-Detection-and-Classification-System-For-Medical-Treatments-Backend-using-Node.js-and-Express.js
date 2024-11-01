const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const cors = require("cors");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("793081215991-vmugq2holch44cjh88n0iam05fneb7o7.apps.googleusercontent.com");

////////////////////////////////////////////////////////////
const User = mongoose.model("User");
const AcneTreatment = mongoose.model("AcneTreatment");
const AcneAnalysis = mongoose.model("AcneAnalysis");

///////////////////////////////////////////////////////////
const authMiddleware = require('../middleware/authmiddleware');
///////////////////////////////////////////////////////
require("dotenv").config();
///////////////////////////////////////////////////////


//////////////////add new user/////////////////
// Route to add a new user
router.post("/addNewUser", async (req, res) => {
  console.log("sent by the client side -", req.body);

  const { email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.send({ message: "User registered successfully" });
  } catch (error) {
    console.log("Database error", error);
    return res.status(422).send({ error: error.message });
  }
});

// Google Signup Route
router.post("/googleSignup", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "793081215991-vmugq2holch44cjh88n0iam05fneb7o7.apps.googleusercontent.com", // Use your Google client ID here
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        email,
        googleId,
        password: null, // Google users do not need a password
      });
      await user.save();
    }

    // You can return a JWT token or set a session here if needed
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "User registered successfully", token: jwtToken });
  } catch (error) {
    console.error("Google token verification failed:", error);
    res.status(400).json({ error: error.message || "Google token verification failed" });
  }
});
////////////////////////////user login////////////////////

router.post("/userLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Increase the token expiration for security
    });

    res.json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/saveAnalysis", authMiddleware, async (req, res) => {
  const { acneTypes } = req.body; // The predicted acne types and scores
  const { email } = req.user; // Get user email from JWT token, populated by authMiddleware

  try {
    const analysis = new AcneAnalysis({
      email,
      acneTypes,
    });
    
    await analysis.save();
    res.status(200).json({ message: "Analysis saved successfully." });
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({ message: "Could not save analysis." });
  }
});

router.post("/getTreatment", async (req, res) => {
  const { acneTypes } = req.body;

  try {
    // Use the array of acne types to find relevant treatments
    const treatments = await AcneTreatment.find({ type: { $in: acneTypes.map(type => type.class) } });
    res.status(200).json(treatments);
  } catch (error) {
    console.error("Error fetching treatments:", error);
    res.status(500).json({ message: "Could not fetch treatments." });
  }
});




module.exports = router;