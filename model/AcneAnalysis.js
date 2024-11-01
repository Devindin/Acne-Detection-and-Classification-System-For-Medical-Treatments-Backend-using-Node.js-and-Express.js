// models/AcneAnalysis.js
const mongoose = require("mongoose");

const acneAnalysisSchema = new mongoose.Schema({
  email: { type: String, required: true },
  acneTypes: [
    {
      class: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AcneAnalysis", acneAnalysisSchema);
