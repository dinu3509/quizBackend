const mongoose = require('mongoose');
const mongourl = process.env.MONGO_CON;

mongoose.connect(mongourl)
.then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{
    console.log("MongoDB Connection Error:",err);
})