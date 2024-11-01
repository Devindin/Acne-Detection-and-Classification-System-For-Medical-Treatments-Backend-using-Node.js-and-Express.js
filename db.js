const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL).then(
    ()=>{
        console.log("Connetcted to database")
    },
)
.catch((error)=>{
   console.log("Could not connected to database"+error)
})

