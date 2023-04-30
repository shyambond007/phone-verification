const express = require('express')
const path = require('path')
const app = express()
const mongoose = require('mongoose')

//PORT on which server is running.
const PORT = 2023

// Static Middleware - this code is for viewing the frontend UI
app.use(express.static(path.join(__dirname, 'public')))

//For parsing the JSON request from the frontend user
app.use(express.json())


//API routes
app.use("/api", require('./routes'))

//Database connection here
const USER_NAME = "shyammohan367"
const PASSWORD = "vEycpHfDJFAls8QS"
const DATABASE_NAME = "mobile_verify_db"

//here connect function is used to connect the database cluster using connection string
mongoose.connect(`mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.fjgmitx.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`).then(() => {
    console.log("Database is connected successfully...!")
}).catch((errorMessage) => {
    console.log("Error: Unable to connect database", errorMessage)
})

//To start the main server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
