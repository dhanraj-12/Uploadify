const express = require('express');
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const dotnev = require("dotenv");
const un_uploadRoute = require("./routes/un_upload");
const un_videoRoute = require("./routes/un_video");
const ed_uploadRoute = require("./routes/ed_upload");
const ed_videoRoute = require("./routes/ed_video");
const authrouter = require("./routes/authroute");
const ytuploadroute = require("./routes/yt_upload");
const statusupdate = require("./routes/ups_route");
const cmtupdate = require("./routes/update_cmt")



dotnev.config()
app.use(express.json())
app.use(cors());
const mongoconnect = async () => {

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB successfully!')
    }catch(err) {
        console.error('Error connecting to MongoDB:', err.message)
    }
}
mongoconnect();

app.use("/api",un_uploadRoute);
app.use("/api",un_videoRoute);
app.use("/api",ed_uploadRoute);
app.use("/api",ed_videoRoute)
app.use("/auth/",authrouter);
app.use("/yt",ytuploadroute);
app.use("/api",statusupdate);
app.use("/api",cmtupdate);

app.listen(port, () => console.log(`uploadify listening on port ${port}!`))