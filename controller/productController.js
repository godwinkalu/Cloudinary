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
    
    const checkExistingProduct = await product.findById(id)
    if (!checkExistingProduct) {
     for(const img of files){
       fs.unlinkSync(img.path)
     }
     return res.status(404).json({
      message:'product not found'
     })
    }
    const oldimagePublicIds = checkExistingProduct.images?.map((el)=>el.publicId)
    const imageArr  = []

    for(const img of files){
     const resource= await cloudinary.uploader.upload(img.path);
     const image = {
      url:resource.secure_url,
      publicId:resource.public_id
     }
     imageArr.push(image)

     fs.unlinkSync(img.path)

     const data = {name,description,price,images:imageArr}
     const updatedProduct = await productmodel.findByIdAndUpdate(id,data,{new:true})
     for(const publicId of oldimagePublicIds){
      await cloudinary.uploader.destroy(publicId)
      
     }

    }
    return  res.status(200).json({
      message:'product updated successfully',
      data:updatedProduct
    })

  } catch (error) {
    for(const img of files){
     fs.unlinkSync(img.path)
    }
return res.status(500).json({
      message:error.message
    })
  }
}