const productmodel = require('../models/productModels')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.addProduct = async (req, res)=>{

  try {
    const {name, description, price} = req.body
    const files = req.files
   const imageDetails = [];

    for(const image of files){
     const result = await cloudinary.uploader.upload(image.path);
     const fileInfo = {
      url:result.secure_url,
      publicId:result.public_id
     }
      imageDetails.push(fileInfo)
    fs.unlinkSync(image.path)

    }
   
    const product = new productmodel({
      name,
      description,
      price,
      images:imageDetails
    })
    res.status(201).json({
      message:'product added successfully',
      data:product
    })

  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.getAllProduct =  async(req,res)=>{
   try {
      const product = await productmodel.find()
      res.status(200).json({
        message:'All product Available',
        data:product
      })
   } catch (error) {
    res.status(500).json({
      message:error.message
    })
   }  
}
exports.getOneProduct = async (req,res)=>{
  try {
    const {id} = req.status
    const product = await productmodel.findById(id)
    if (!product) {
      return res.status(400).json({
        message:'user not found'
      })
    }
    res.status(200).json({
      message:'Get one product successfully',
      data:product
    })
  } catch (error) {
   res.status(500).json({
    message:error.message
   }) 
  }
}
exports.deleteProduct = async (req,res)=>{

  try {
    const {id} = req.params;
    const product = await productmodel.findByIdAndDelete(id)
    if (!product) {
      return res.status(404).json({
        message:'product not found'
      })

    }
    await cloudinary.uploader.destroy(product.profilePicture.publicId)

    res.status(200).json({
      message:'product deleted successfully',
      data : product
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.updateProduct  = async (req,res)=>{
  try {
    const {id} =  req.params
    const {name,description,price} =  req.body;
    const files = req.files
    const imageDetails = [];
    for(const image of files){
     const resource= await cloudinary.uploader.upload(image.path);
     const images = {
      url:resource.secure_url,
      publicId:resource.public_id
     }
     const data = {name,description,price,profilePicture:images}
     const updatedProduct = await productmodel.findByIdAndUpdate(id,data,{new:true})
     if (!updatedProduct) {
      return res.status(404).json({
        message:'user not found'
      })
     }
     await cloudinary.uploader.destroy(updatedProduct.profilePicture.publicId)
      imageDetails.push(fileInfo)
    fs.unlinkSync(images.path)

    }
    return  res.status(200).json({
      message:'product updated successfully',
      data:updatedProduct
    })

  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}