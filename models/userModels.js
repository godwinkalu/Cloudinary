const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     fullName: {
      type: String,
      required:true
     },
     gender:{
      type:String,
      enum: ['Male','Female'],
      required:true
     },
     email:{
      type:String,
      unique:true,
      required:true

     },
     profilePicture:{
      url:{
        type:String,
        required:true

      },
      publicId:{
        type:String,
        required:true
      }
      
     },
     

}, {timestamps:true});

const usermodel = mongoose.model('user',userSchema)

module.exports = usermodel