const mongoose = require("mongoose");

const AcneTreatmentSchema = new mongoose.Schema({
    type: String,
    treatment: String,
    advice: String
  });
  const AcneTreatment = mongoose.model("AcneTreatment", AcneTreatmentSchema);
  
module.exports = AcneTreatment;
