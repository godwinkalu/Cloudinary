const usermodel = require('../models/userModels')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const e = require('express')
const { url } = require('inspector')
exports.createUser = async (req,res)=>{

  try {
    const {fullName,email,gender,}= req.body
    const file = req.file

    const userExists = await usermodel.findOne({email:email.toLowerCase()})
    if (userExists) {
      return res.status(400).json({
        message:'user already registered'
      })
    }
    
    const result = await cloudinary.uploader.upload(file.path);
    console.log('Result',result);

    fs.unlinkSync(file.path)

    const image ={
      url:result.secure_url,
      publicId:result.public_id
    }
    const user = new usermodel({
      fullName,
      email:email.toLowerCase(),
      gender,
      profilePicture:image
    })
    await user.save()

  

    res.status(201).json({
      message:'user registered successfully',
      data:user
    })
  } catch (error) {
    fs.unlinkSync(req.file.path)
    res.status(500).json({
      message:error.message
    })
  }
}

exports.deleteUser = async (req,res)=>{

  try {
    const {id} = req.params;
    const user = await usermodel.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({
        message:'user not found'
      })

    }
    await cloudinary.uploader.destroy(user.profilePicture.publicId)

    res.status(200).json({
      message:'user deleted successfully',
      data : user
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.allUsers = async (req ,res)=>{
  try {
    const users = await usermodel.find()
    res.status(200).json({
      message:'get all users successfully',
      data:users
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.updateUser = async (req,res)=>{

  try {
    const {id} = req.params
    const file = req.file
    const {fullName,email,gender} = req.body
    const resource =  await cloudinary.uploader.upload(file.path)
    const images = {
      url:resource.secure_url,
      publicId:resource.public_id,
    }
    const data = {fullName,email:email?.toLowerCase(), gender,profilePicture:images}
    const updatedUser = await usermodel.findByIdAndUpdate(id,data,{new:true})
    if (!updatedUser) {
      return res.status(404).json({
        message:'user not found'
      })
    }
    await cloudinary.uploader.destroy(updatedUser.profilePicture.publicId)
    fs.unlinkSync(file.path)
    return res.status(200).json({
      message:'user updated successfully',
      data:updatedUser
    })
  
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.getOneUser = async (req,res)=>{

  try {
    const {id}=req.params
    const user = await usermodel.findById(id)
    if (!user) {
      return res.status(400).json({
        message:'user not found'
      })
    }
    res.status(200).json({
      message:'get one user successfully',
      data:user
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}