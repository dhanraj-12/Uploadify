const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose")
const cors = require("cors")
const dotnev = require("dotenv")
const uploadRoute = require("./routes/upload")

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

app.use("/api",uploadRoute)



app.listen(port, () => console.log(`uploadify listening on port ${port}!`))