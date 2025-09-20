const multer = require('multer')

const storage = multer.diskStorage({
   destination: (req,file,cb)=>{
       cb(null,'./uploads')
   },
   filename : (req,file,cb) =>{
     cb(null,file.originalname)
   }
});

const fileFilter = (req,file, cb)=>{
  if (file.mimetype.startsWith('image/')) {
     cb(null,true)
  }else{
    cb(new Error ('Invaild file format,Only image allowed'))
  }
};
const limits = {
  filesiz: 1024 * 1024 * 1
}

const uploads = multer({
  storage,
  fileFilter,
  limits
})
module.exports = uploads;