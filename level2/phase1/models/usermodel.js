const mongoose = require("mongoose");

const User = mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String}
},{timestamps:true});


userModel = mongoose.model("User",User);




module.exports = userModel;
