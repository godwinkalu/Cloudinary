const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
       name: {
        type: String,
        required:true
       },
       description:{
        type:String,
        required:true,
       },
       price:{
        type:Number,
        unique:true,
        required:true
  
       },
       images:{
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
  
  const productmodel = mongoose.model('product',productSchema)
  
  module.exports = productmodel
