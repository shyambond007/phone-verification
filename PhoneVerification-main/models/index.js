const mongoose = require('mongoose')


const mobileSchema = mongoose.Schema({
    phone:{
        type:String,
        maxLength:10,
        required:true
    },
    OTP:{
        type:String
    }
})

module.exports = mongoose.model("mobile_numbers",mobileSchema)