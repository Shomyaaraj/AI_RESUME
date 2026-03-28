const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "username already taken"],
        required: true,
    },

    email:{
        type: String,
        unique:[true, "Account already exists with this Email address "]
    },

    password:{
        type: String,
        required: true
    }
})


const userMOdel = mongoose.model("users", userSchema)

module.exports=userMOdel